pipeline {
    agent any

    environment {
        // Variables d'environnement pour Docker
        DOCKER_HOST = 'unix:///var/run/docker.sock'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/ton-utilisateur/SkillUpTN.git', branch: 'main'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose -f docker-compose.yml build'
            }
        }

        stage('Run Tests Backend') {
            steps {
                sh 'docker-compose -f docker-compose.yml run backend npm run test'
            }
        }

        stage('Deploy Containers') {
            steps {
                sh 'docker-compose -f docker-compose.yml up -d'
            }
        }
    }

    post {
        success {
            echo 'Pipeline terminé avec succès !'
        }
        failure {
            echo 'Pipeline échoué.'
        }
    }
}
