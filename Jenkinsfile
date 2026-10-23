
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                sh '''
                    cd app
                    chmod +x mvnw
                    ./mvnw clean verify
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t cloudopslab-api:latest app
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    docker rm -f cloudopslab-api-container || true
                    docker run -d \
                        --name cloudopslab-api-container \
                        -p 8082:8080 \
                        --restart unless-stopped \
                        cloudopslab-api:latest
                '''
            }
        }

        stage('Build Summary') {
            steps {
                echo 'CloudOpsLab build, tests, image build, and deployment completed!'
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline succeeded.'
        }
        failure {
            echo 'CI/CD pipeline failed. Check the console output.'
        }
    }
}
