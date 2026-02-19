pipeline {
    agent any

    options {
        // Empêche Jenkins de faire un checkout automatique supplémentaire.
        // On gère nous-mêmes le checkout dans le stage "Checkout".
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout') {
            steps {
                echo "🔄 Cloning repository..."
                // Nettoyer complètement le workspace pour éviter les anciens .git corrompus
                deleteDir()
                git branch: 'main', url: 'https://github.com/medamin87737/SkillUpTnFrontBack.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo "🔍 Running SonarQube analysis..."
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        sh """
                          "${scannerHome}/bin/sonar-scanner" \
                            -Dsonar.projectKey=SkillUpTN \
                            -Dsonar.projectName=SkillUpTN \
                            -Dsonar.sources=backend,frontend
                        """
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🛠 Building Docker images..."
                sh 'docker-compose build'
            }
        }

        stage('Cleanup Before Deploy') {
            steps {
                echo "🧹 Removing old containers and volumes..."
                sh 'docker-compose down -v || true'
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo "🧪 Running backend tests..."
                sh 'docker-compose run backend npm run test'
            }
        }

        stage('Deploy Containers') {
            steps {
                echo "🚀 Deploying containers..."
                sh 'docker-compose up -d --force-recreate'
            }
        }

        stage('Final Cleanup') {
            steps {
                echo "🧹 Cleaning unused Docker resources..."
                sh 'docker system prune -f || true'
            }
        }
    }

    post {
        success { echo "✅ Pipeline terminé avec succès" }
        failure { echo "❌ Pipeline échoué" }
    }
}
