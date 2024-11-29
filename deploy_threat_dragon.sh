#!/bin/bash

# Exit on errors
set -e

# Load variables
source ./deploy_threat_dragon_vars.sh

# Update system and install prerequisites
echo "Updating system and installing prerequisites..."
sudo yum update -y
sudo yum install -y git nginx tar

# Install Node.js v22
echo "Installing Node.js v22..."
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs

# Verify Node.js installation
echo "Verifying Node.js installation..."
node -v
if ! node -v | grep -q "v22"; then
  echo "Node.js v22 installation failed. Exiting."
  exit 1
fi

# Handle existing Threat Dragon directory
if [ -d "$INSTALL_DIR" ]; then
  if [ "$(ls -A $INSTALL_DIR)" ]; then
    echo "The directory $INSTALL_DIR already exists and is not empty."
    echo "Choose an action:"
    echo "  1. Skip cloning (use existing directory)."
    echo "  2. Overwrite (delete the existing directory and clone again)."
    echo "  3. Exit."
    read -p "Enter your choice (1/2/3): " choice
    case $choice in
      1)
        echo "Skipping cloning. Using the existing directory."
        ;;
      2)
        echo "Overwriting the existing directory..."
        rm -rf "$INSTALL_DIR"
        ;;
      3)
        echo "Exiting."
        exit 1
        ;;
      *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
    esac
  fi
fi

# Clone the Threat Dragon repository
if [ ! -d "$INSTALL_DIR" ]; then
  echo "Cloning OWASP Threat Dragon repository to $INSTALL_DIR..."
  mkdir -p "$INSTALL_DIR"
  git clone https://github.com/syed-talha98/threat-dragon.git "$INSTALL_DIR"
fi
cd "$INSTALL_DIR" && git checkout nginx-local

# Install dependencies and build Threat Dragon
echo "Installing dependencies and building Threat Dragon..."
npm install
npm run build

# Set up Threat Dragon as a background service
echo "Setting up Threat Dragon to run on port $THREAT_DRAGON_PORT..."
sudo bash -c "cat <<EOF > /etc/systemd/system/threat-dragon.service
[Unit]
Description=OWASP Threat Dragon Service
After=network.target

[Service]
Type=simple
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/npm start
Restart=on-failure
User=ec2-user

[Install]
WantedBy=multi-user.target
EOF"

sudo systemctl daemon-reload
sudo systemctl enable threat-dragon
sudo systemctl start threat-dragon

# Configure Nginx
echo "Configuring Nginx..."
sudo bash -c "cat > $NGINX_CONF <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Redirect HTTP to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    # SSL Certificates
    ssl_certificate $SSL_CERT_PATH;
    ssl_certificate_key $SSL_KEY_PATH;

    # Reverse Proxy to Threat Dragon
    location / {
        proxy_pass http://127.0.0.1:$THREAT_DRAGON_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade '$http_upgrade';
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host '$host';
        proxy_cache_bypass '$http_upgrade';
    }
}
EOF"

sudo systemctl restart nginx

# Configure firewall
echo "Configuring firewall..."
sudo amazon-linux-extras enable epel
sudo yum install -y firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Display completion message
echo "Deployment complete. Access OWASP Threat Dragon at https://$DOMAIN"
