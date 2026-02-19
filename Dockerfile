# Dockerfile
FROM jenkins/jenkins:lts

USER root

# Installer Docker et Docker Compose
RUN apt update && apt install -y docker.io docker-compose

# Créer le groupe docker et ajouter l'utilisateur Jenkins
RUN groupadd docker || true && usermod -aG docker jenkins

USER jenkins
