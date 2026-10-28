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
                sh 'docker build -t cloudopslab-api:latest app'
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    docker rm -f cloudopslab-api-container || true
                    docker run -d                         --name cloudopslab-api-container                         -p 8082:8080                         --restart unless-stopped                         cloudopslab-api:latest
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Checking application health..."
                    for attempt in $(seq 1 30); do
                        if curl --fail --silent http://host.docker.internal:8082/health; then
                            echo "Health check passed!"
                            exit 0
                        fi
                        echo "Attempt $attempt failed. Retrying in 2 seconds..."
                        sleep 2
                    done
                    echo "Health check failed."
                    docker logs cloudopslab-api-container || true
                    exit 1
                '''
            }
        }


        stage("Push Docker Image to Docker Hub") {
            steps {
                withCredentials([usernamePassword(credentialsId: "dockerhub", usernameVariable: "DOCKERHUB_USERNAME", passwordVariable: "DOCKERHUB_TOKEN")]) {
                    sh('''
                        set +x
                        printf "%s" "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                        docker tag cloudopslab-api:latest "$DOCKERHUB_USERNAME/cloudopslab-api:latest"
                        docker push "$DOCKERHUB_USERNAME/cloudopslab-api:latest"
                        docker logout
                    ''')
                }
            }
        }

        stage('Build Summary') {
            steps {
                echo 'CloudOpsLab CI/CD pipeline completed successfully!'
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
