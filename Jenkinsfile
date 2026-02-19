pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "skillup-backend"
        FRONTEND_IMAGE = "skillup-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/medamin87737/SkillUpTnFrontBack.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.yml build'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.yml run backend npm run test'
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline terminé avec succès ✅"
        }
        failure {
            echo "Pipeline échoué ❌"
        }
    }
}
