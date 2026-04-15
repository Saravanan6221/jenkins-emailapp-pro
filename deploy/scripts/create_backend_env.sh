#!/bin/bash
cat > /opt/emailapp/backend/.env <<EOF
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=emailappuser
DB_PASSWORD=ChangeThisPassword123!
DB_NAME=emailappdb
EOF

echo "Backend .env file created at /opt/emailapp/backend/.env"
