#!/bin/bash

keyShare=4
keyThreshold=2
keyFile=/vault/keys/generated_keys.txt
vaultURL=https://vault:8200
CERT_PATH="/certs"
CA_PATH="${CERT_PATH}/ca"
CA_CERT="${CA_PATH}/ca.crt"
CA_KEY="${CA_PATH}/ca.key"
CA_NAME="42_cert"
JSON_PATH="/vault/settings"
POLICY_PATH="/vault/policies"
JWT_SECRET=$(openssl rand -base64 32)

#init vault
echo "initializing vault."
curl --cacert ${CA_CERT} -s  ${vaultURL}/v1/sys/init | grep -q -x '{"initialized":true}'
if [ $? -eq 0 ]; then
    echo "vault was already initialized."
    exit 0
else
    curl --cacert ${CA_CERT} -s -XPOST \
        ${vaultURL}/v1/sys/init \
        --data "{
                \"secret_shares\": ${keyShare}, \
                \"secret_threshold\": ${keyThreshold}
            }" \
        | jq > ${keyFile}
    curl -k -s  ${vaultURL}/v1/sys/init | grep -q -x '{"initialized":true}'
    if [ $? -eq 0 ]; then
        echo "vault was successfully initialized."
    else
        echo "ERROR: vault initailization failed."
        exit 1
    fi
fi

#unseal vault
echo "unsealing vault."
TOKEN=$(jq -r '.root_token' ${keyFile})
for i in $(seq 0 $((${keyThreshold} - 1)))
do
    key=$(jq ".keys[$i]" ${keyFile})
    curl --cacert ${CA_CERT} -s -XPOST \
        ${vaultURL}/v1/sys/unseal \
        --data "{\"key\": ${key}}"
done
curl --cacert ${CA_CERT} -i -s  ${vaultURL}/v1/sys/health | grep 'HTTP' | awk '{print $2}' | grep -q -x '200'
if [ $? -eq 0 ]; then
    echo "vault was successfully unsealed."
else
    echo "ERROR: vault unsealing failed."
    exit 1
fi

#create polices
echo "creating policies."
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/sys/policy/server \
    -H "X-Vault-Token: ${TOKEN}" \
    --data @${POLICY_PATH}/server_policy.json
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/sys/policy/prometheus \
    -H "X-Vault-Token: ${TOKEN}" \
    --data @${POLICY_PATH}/prometheus_policy.json

#enable userpass
echo "enabling userpass."
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/sys/auth/userpass \
    -H "X-Vault-Token: ${TOKEN}" \
    --data '{
        "type": "userpass",
        "description": "For Django server"
    }'
curl --cacert ${CA_CERT} -s  ${vaultURL}/v1/sys/auth -H "X-Vault-Token: ${TOKEN}" | grep 'userpass/'
if [ $? -eq 0 ]; then
    echo "enable userpass."
else
    echo "ERROR: enabling userpass failed."
    exit 1
fi

#create userpass
echo "creating userpass."
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/auth/userpass/users/server \
    -H "X-Vault-Token: ${TOKEN}" \
    --data "{
        \"password\": \"${VAULT_SERVER_PASSWORD}\",
        \"token_policies\": [\"server\"]
    }"
curl --cacert ${CA_CERT} -s ${vaultURL}/v1/auth/userpass/users/server -H "X-Vault-Token: ${TOKEN}" | grep -q 'request_id'
if [ $? -eq 0 ]; then
    echo "create user 'server'."
else
    echo "ERROR: creating user failed."
    exit 1
fi

#enable kv
echo "enabling kv engine."
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/sys/mounts/kv \
    -H "X-Vault-Token: ${TOKEN}" \
    --data '{
            "type": "kv",
            "options": {
                "version": "2"
            }
        }'
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/kv/config \
    -H "X-Vault-Token: ${TOKEN}" \
    --data '{
        "max_versions": 5,
        "cas_required": false
    }'
curl -s --cacert ${CA_CERT} -H "X-Vault-Token: ${TOKEN}" ${vaultURL}/v1/sys/mounts | grep -q 'kv/'
if [ $? -eq 0 ]; then
    echo "enable kv engine."
else
    echo "ERROR: enabling kv engine failed."
    exit 1
fi

#creating secrets.
echo "creating secrets."
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/kv/data/django-secret \
    -H "X-Vault-Token: ${TOKEN}" \
    --data "{
        \"data\": {
            \"USER_SERVER_SECRET_KEY\": \"${USER_SERVER_SECRET_KEY}\",
            \"GAME_SERVER_SECRET_KEY\": \"${GAME_SERVER_SECRET_KEY}\",
            \"JWT_SECRET\": \"${JWT_SECRET}\"
        }
    }"

#creating prometheus token
echo "creating prometheus token."
TOKEN_PATH="/certs/prometheus/"
mkdir -p ${TOKEN_PATH}
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/auth/token/create \
    -H "X-Vault-Token: ${TOKEN}" \
    --data @${JSON_PATH}/prometheus_token.json \
    | jq -r .auth.client_token > ${TOKEN_PATH}/vault_token.txt

#enabling pki engine
echo "enabling pki engine."
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/sys/mounts/pki \
    -H "X-Vault-Token: ${TOKEN}" \
    --data '{
            "type": "pki"
        }'

#importing pki CA
echo "importing pki CA"
PKI_JSON="pki.json"
echo "{\"pem_bundle\":\"$(cat ${CA_CERT})\n$(cat ${CA_KEY})\"}" | sed ':a;N;$!ba;s/\n/\\n/g' > ${PKI_JSON}
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/pki/config/ca \
    -H "X-Vault-Token: ${TOKEN}" \
    --data @${PKI_JSON}

#configuring pki
echo "configuring pki."
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/pki/config/urls \
    -H "X-Vault-Token: ${TOKEN}" \
    --data @${JSON_PATH}/pki_config.json

#creating pki role
echo "creating pki role."
curl --cacert ${CA_CERT} -s -XPOST \
    ${vaultURL}/v1/pki/roles/${CA_NAME} \
    -H "X-Vault-Token: ${TOKEN}" \
    --data @${JSON_PATH}/pki_role.json

#creating certificates
echo "creating certificates."
CERT_NAMES="es01 es02 kibana logstash filebeat nginx grafana userserver gameserver"
for CERT_NAME in ${CERT_NAMES}; do
    response=$(curl --cacert ${CA_CERT} -s -XPOST \
        ${vaultURL}/v1/pki/issue/${CA_NAME} \
        -H "X-Vault-Token: ${TOKEN}" \
        --data "{
            \"common_name\": \"${CERT_NAME}\",
            \"alt_names\": \"localhost\",
            \"ip_sans\": \"127.0.0.1\"
        }")
    mkdir -p "${CERT_PATH}/${CERT_NAME}"
    echo ${response} | jq -r .data.certificate > "${CERT_PATH}/${CERT_NAME}/${CERT_NAME}.crt"
    echo ${response} | jq -r .data.private_key > "${CERT_PATH}/${CERT_NAME}/${CERT_NAME}.key"
done

echo "==========DONE=========="
