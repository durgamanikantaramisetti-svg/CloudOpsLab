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

        stage('Build Summary') {
            steps {
                echo 'CloudOpsLab build and tests completed successfully!'
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
