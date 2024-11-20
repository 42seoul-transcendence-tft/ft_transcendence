YML_PATH := ./srcs/docker-compose.yml
SCRIPTS_PATH := ./srcs/scripts

.PHONY: all
all:
	sh set_ip.sh
	docker compose -f $(YML_PATH) up --build -d

.PHONY: only_compose
only_compose:
	docker compose -f $(YML_PATH) up --build -d

.PHONY: up
up:
	docker compose -f $(YML_PATH) up -d

.PHONY: build
build:
	docker compose -f $(YML_PATH) build

.PHONY: down clean
clean down:
	docker compose -f $(YML_PATH) down

.PHONY: fclean
fclean:
	docker compose -f $(YML_PATH) down --volumes

.PHONY: re
re: fclean
	make all

.PHONY: certs
certs:
	sh $(SCRIPTS_PATH)/elk_copy_certs.sh

.PHONY: token
token:
	sh $(SCRIPTS_PATH)/elk_get_tokens.sh

.PHONY: elk
elk: certs token

.PHONY: delete_unused_imgs
delete_unused_imgs:
	sh $(SCRIPTS_PATH)/clear.sh
