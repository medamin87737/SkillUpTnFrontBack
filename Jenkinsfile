pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "skillup-backend"
        FRONTEND_IMAGE = "skillup-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "🔄 Cloning repository..."
                git branch: 'main', url: 'https://github.com/medamin87737/SkillUpTnFrontBack.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🛠 Building Docker images..."
                sh 'docker compose -f docker-compose.yml build'
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo "🧪 Running backend tests..."
                sh 'docker compose -f docker-compose.yml run backend npm run test'
            }
        }

        stage('Deploy Containers') {
            steps {
                echo "🚀 Deploying containers..."
                sh 'docker compose -f docker-compose.yml up -d'
            }
        }

        stage('Cleanup') {
            steps {
                echo "🧹 Cleaning up unused Docker resources..."
                sh 'docker system prune -f'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline terminé avec succès"
        }
        failure {
            echo "❌ Pipeline échoué"
        }
    }
}
