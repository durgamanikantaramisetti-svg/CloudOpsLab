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

        stage('Build Summary') {
            steps {
                echo 'CloudOpsLab build, tests, and Docker image completed successfully!'
            }
        }
    }

    post {
        success {
            echo 'CI pipeline succeeded.'
        }
        failure {
            echo 'CI pipeline failed. Check the console output.'
        }
    }
}
