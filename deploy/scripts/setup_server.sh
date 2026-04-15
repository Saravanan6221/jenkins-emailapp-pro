#!/bin/bash
set -e

echo "Updating packages..."
sudo apt update

echo "Installing required packages..."
sudo apt install -y nginx python3-pip python3-venv mysql-server rsync openjdk-17-jdk

echo "Starting services..."
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl enable mysql
sudo systemctl start mysql

echo "Creating application directories..."
sudo mkdir -p /opt/emailapp/backend
sudo mkdir -p /var/www/emailapp
sudo chown -R ubuntu:ubuntu /opt/emailapp
sudo chown -R ubuntu:ubuntu /var/www/emailapp

echo "Configuring MySQL database..."
sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS emailappdb;
CREATE USER IF NOT EXISTS 'emailappuser'@'localhost' IDENTIFIED BY 'ChangeThisPassword123!';
GRANT ALL PRIVILEGES ON emailappdb.* TO 'emailappuser'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "Installing Nginx configuration..."
sudo cp deploy/nginx/emailapp.conf /etc/nginx/sites-available/emailapp.conf
sudo ln -sf /etc/nginx/sites-available/emailapp.conf /etc/nginx/sites-enabled/emailapp.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "Server setup completed successfully"
