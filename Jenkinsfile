pipeline {
    agent any

    stages {
        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'chmod +x node_modules/.bin/vite'
                    sh 'npm run build'
                }
            }
        }

        stage('Copy to Server') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no ubuntu@172.31.28.31 "mkdir -p /home/ubuntu/app"
                rsync -avz --exclude '.git' --exclude 'node_modules' -e "ssh -o StrictHostKeyChecking=no" ./ ubuntu@172.31.28.31:/home/ubuntu/app/
                '''
            }
        }

        stage('Backend Setup') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no ubuntu@172.31.28.31 "
                cd /home/ubuntu/app/backend &&
                python3 -m venv venv &&
                . venv/bin/activate &&
                pip install -r requirements.txt
                "
                '''
            }
        }

        stage('Restart Services') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no ubuntu@172.31.28.31 "
                sudo systemctl restart emailapp-backend &&
                sudo systemctl restart nginx
                "
                '''
            }
        }
    }
}
