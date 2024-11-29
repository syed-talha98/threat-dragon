#!/bin/bash

# Domain Name and SSL Paths
DOMAIN="td.devflovv.com"
SSL_CERT_PATH="/home/ec2-user/devflovv/certs/server.crt"
SSL_KEY_PATH="/home/ec2-user/devflovv/certs/server.key"
# Threat Dragon Configuration
THREAT_DRAGON_PORT=3000
INSTALL_DIR="/home/ec2-user/threat-dragon"

# Nginx Configuration
NGINX_CONF="/etc/nginx/conf.d/threat-dragon.conf"
