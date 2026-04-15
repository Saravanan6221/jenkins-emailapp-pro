pipeline {
    agent none

    environment {
        APP_DIR = '/opt/emailapp'
        WEB_DIR = '/var/www/emailapp'
    }

    stages {
        stage('Checkout on Master') {
            agent { label 'master' }
            steps {
                checkout scm
                stash includes: '**', name: 'source-code'
            }
        }

        stage('Build Frontend on Master') {
            agent { label 'master' }
            steps {
                unstash 'source-code'
                dir('frontend') {
                    sh '''
                    npm install
                    npm run build
                    '''
                }
                stash includes: 'frontend/dist/**, backend/**, deploy/**, Jenkinsfile, README.md, HANDS_ON_GUIDE.md', name: 'build-output'
            }
        }

        stage('Deploy on Agent') {
            agent { label 'deploy-agent' }
            steps {
                unstash 'build-output'
                sh '''
                sudo mkdir -p ${APP_DIR}
                sudo mkdir -p ${WEB_DIR}
                sudo chown -R $USER:$USER ${APP_DIR}
                sudo chown -R $USER:$USER ${WEB_DIR}

                rm -rf ${APP_DIR}/backend ${APP_DIR}/deploy
                rm -rf ${WEB_DIR:?}/*
                mkdir -p ${APP_DIR}

                cp -r backend ${APP_DIR}/
                cp -r deploy ${APP_DIR}/
                cp backend/.env.example ${APP_DIR}/backend/.env
                cp -r frontend/dist/* ${WEB_DIR}/

                chmod +x ${APP_DIR}/deploy/scripts/*.sh
                ${APP_DIR}/deploy/scripts/post_deploy.sh
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully'
        }
        failure {
            echo 'Pipeline failed. Check stage logs.'
        }
    }
}
