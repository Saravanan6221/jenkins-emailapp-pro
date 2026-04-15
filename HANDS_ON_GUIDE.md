# Beginner Hands-On Guide
## Jenkins CI/CD Master-Agent Project on AWS EC2

This guide is written in a simple beginner way.

## 1. What you are building

You will build one full stack application:

- Frontend -> React app
- Backend -> FastAPI
- Database -> MySQL
- Web server -> Nginx
- CI/CD -> Jenkins Master and Jenkins Agent
- Cloud -> AWS EC2

Real flow:

Developer pushes code to GitHub
-> GitHub webhook triggers Jenkins
-> Jenkins Master starts pipeline
-> Jenkins Agent deploys app on Deployment EC2
-> Nginx serves frontend
-> Nginx sends API calls to FastAPI
-> FastAPI stores data in MySQL

## 2. EC2 servers needed

Create 2 Ubuntu EC2 servers.

Server 1: Jenkins Master
Open ports:
- 22
- 8080

Server 2: Deployment Server + Jenkins Agent
Open ports:
- 22
- 80
- 8000 (optional for direct testing)

## 3. Install Jenkins on Master EC2

sudo apt update
sudo apt install -y openjdk-17-jdk curl gnupg
java -version

curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo gpg --dearmor -o /usr/share/keyrings/jenkins-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.gpg] https://pkg.jenkins.io/debian binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install -y jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins
sudo systemctl status jenkins

Open in browser:
http://MASTER_PUBLIC_IP:8080

Get admin password:
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

## 4. Install Node.js on Master EC2

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v

## 5. Push this project to GitHub

git init
git add .
git commit -m "Initial commit for Jenkins email app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main

## 6. Setup Deployment EC2 server

Copy this project folder to Deployment server once, then run:

chmod +x deploy/scripts/setup_server.sh
./deploy/scripts/setup_server.sh

Then create backend env:

chmod +x deploy/scripts/create_backend_env.sh
./deploy/scripts/create_backend_env.sh

## 7. Configure Deployment Server as Jenkins Agent

On Jenkins UI:
- Manage Jenkins
- Nodes
- New Node
- Name: deployment-agent
- Type: Permanent Agent

Recommended settings:
- Number of executors: 1
- Remote root directory: /home/ubuntu/jenkins-agent
- Labels: deploy-agent
- Launch method: Launch agents via SSH

Use Deployment server private IP and Ubuntu credentials.

## 8. Install Java on Deployment Server

sudo apt update
sudo apt install -y openjdk-17-jdk
java -version

## 9. Create Jenkins Pipeline Job

In Jenkins:
- New Item
- Name: emailapp-cicd
- Type: Pipeline

Pipeline settings:
- Definition: Pipeline script from SCM
- SCM: Git
- Repo URL: your GitHub repo
- Branch: */main
- Script Path: Jenkinsfile

## 10. Configure GitHub webhook

In GitHub repo:
- Settings
- Webhooks
- Add webhook

Payload URL:
http://MASTER_PUBLIC_IP:8080/github-webhook/

Content type:
application/json

Event:
Just the push event

In Jenkins job, enable:
GitHub hook trigger for GITScm polling

## 11. Test the application

Frontend:
http://DEPLOYMENT_PUBLIC_IP

API health:
http://DEPLOYMENT_PUBLIC_IP/health

API list:
http://DEPLOYMENT_PUBLIC_IP/api/emails

## 12. Useful commands

Check backend service:
sudo systemctl status emailapp-backend

Restart backend:
sudo systemctl restart emailapp-backend

Check Nginx:
sudo systemctl status nginx
sudo nginx -t

Check Jenkins logs:
sudo journalctl -u jenkins -f

Check MySQL:
sudo mysql -e "SHOW DATABASES;"
sudo mysql -e "USE emailappdb; SHOW TABLES;"
sudo mysql -e "SELECT * FROM emailappdb.emails;"

## 13. Common beginner mistakes

- Frontend not loading -> check port 80 in security group
- Agent not connecting -> install Java and verify SSH
- npm build failing -> install Node.js on Master
- Backend not starting -> check /opt/emailapp/backend/.env
- DB error -> check MySQL service and credentials

## 14. Final result

After every GitHub push:
- Jenkins webhook triggers automatically
- Jenkins builds frontend on Master
- Jenkins deploys app on Agent server
- Application updates automatically
