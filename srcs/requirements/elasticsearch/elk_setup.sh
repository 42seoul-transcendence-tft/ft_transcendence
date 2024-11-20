#!/bin/bash

ES_URL="https://es01:9200";
KIBANA_URL="https://kibana:5601";

if [ x${ELASTIC_PASSWORD} == x ]; then
    echo "Set the ELASTIC_PASSWORD environment variable in the .env file";
    exit 1;
elif [ x${KIBANA_PASSWORD} == x ]; then
    echo "Set the KIBANA_PASSWROD environment variable in the .env file";
    exit 1;
elif [ x${LOGSTASH_INTERNAL_PASSWORD} == x ]; then
    echo "Set the LOGSTASH_INTERNAL_PASSWROD environment variable in the .env file";
    exit 1;
fi

echo "Waiting for Elasticsearch availability";
until curl -s --cacert config/certs/ca/ca.crt https://es01:9200 | grep -q "missing authentication credentials";
    do sleep 5;
done;
echo "Setting kibana_system password";
until curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" ${ES_URL}/_security/user/kibana_system/_password -d "{\"password\":\"${KIBANA_PASSWORD}\"}" | grep -q "^{}";
    do sleep 5;
done;
echo "Setting logstash_writer role";
until curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" ${ES_URL}/_security/role/logstash_writer -d '{"cluster": ["manage_index_templates", "monitor", "manage_ilm"], "indices": [{"names": [ "log-*" ], "privileges": ["write","create","create_index","manage","manage_ilm"]}]}' | grep -q '{"role":{"created":true}}';
    do sleep 5;
done;
echo "Setting logstash_internal account";
until curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" ${ES_URL}/_security/user/logstash_internal -d "{\"password\" : \"${LOGSTASH_INTERNAL_PASSWORD}\", \"roles\" : [ \"logstash_writer\"], \"full_name\" : \"Internal Logstash User\"}" | grep -q '{"created":true}';
    do sleep 5;
done;
echo "Setting log policies";
until curl -s -X PUT --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" ${ES_URL}/_ilm/policy/django-policy -d '{"policy":{"phases":{"hot":{"min_age":"0ms","actions":{"rollover":{"max_age":"10m","max_size":"100kb","max_primary_shard_size":"100kb"},"set_priority":{"priority":100}}},"warm":{"min_age":"1m","actions":{"readonly":{},"set_priority":{"priority":50},"shrink":{"number_of_shards":1}}},"cold":{"min_age":"5m","actions":{"readonly":{},"set_priority":{"priority":0}}},"delete":{"min_age":"20m","actions":{"delete":{"delete_searchable_snapshot":true}}}}}}' | grep -q '{"acknowledged":true}';
    do sleep 5;
done;
echo "Importing kibana settings";
until curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" -H "kbn-xsrf: true" ${KIBANA_URL}/api/saved_objects/_import --form file=@settings/kibana_objects.ndjson | grep -q '"success":true'
    do sleep 5;
done;

echo "\033[34mDone!\033[0m";