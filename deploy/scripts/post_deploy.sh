#!/bin/bash
set -e

echo "Creating Python virtual environment..."
python3 -m venv /opt/emailapp/venv
source /opt/emailapp/venv/bin/activate
pip install --upgrade pip
pip install -r /opt/emailapp/backend/requirements.txt

echo "Creating database table..."
cd /opt/emailapp/backend
python init_db.py

echo "Installing systemd service..."
sudo cp /opt/emailapp/deploy/systemd/emailapp-backend.service /etc/systemd/system/emailapp-backend.service
sudo systemctl daemon-reload
sudo systemctl enable emailapp-backend
sudo systemctl restart emailapp-backend

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Deployment completed successfully"
