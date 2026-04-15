# Jenkins CI/CD Email App Project

This is a beginner-friendly full stack project for learning Jenkins CI/CD on AWS EC2 using:

- Jenkins Master on EC2
- Jenkins Agent on Deployment EC2
- React frontend
- FastAPI backend
- MySQL database
- Nginx reverse proxy
- systemd service management

## Project Flow

GitHub Push -> Jenkins Master -> Jenkins Agent -> Build + Deploy -> Nginx -> FastAPI -> MySQL

## Folder Details

- `frontend/` -> React application
- `backend/` -> FastAPI application
- `deploy/nginx/` -> Nginx config
- `deploy/systemd/` -> systemd service file
- `deploy/scripts/` -> setup and deployment scripts
- `Jenkinsfile` -> Jenkins pipeline

## Important Notes

Before running this project:

1. Create a GitHub repository and push this code
2. Install Jenkins on Master EC2
3. Configure Deployment EC2 as Jenkins Agent with label `deploy-agent`
4. Run `deploy/scripts/setup_server.sh` once on Deployment EC2
5. Create backend environment file using `deploy/scripts/create_backend_env.sh`
6. Create Jenkins Pipeline job using this repository

## Default App URLs

- Frontend: `http://<DEPLOYMENT-SERVER-PUBLIC-IP>`
- API Health: `http://<DEPLOYMENT-SERVER-PUBLIC-IP>/health`
- API List: `http://<DEPLOYMENT-SERVER-PUBLIC-IP>/api/emails`
