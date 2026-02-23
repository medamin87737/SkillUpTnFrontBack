## Guide DevOps – SkillUpTN

Ce document explique **toute la partie DevOps** du projet SkillUpTN :

- Quels fichiers sont liés au DevOps.
- Comment installer / lancer / arrêter les différents services.
- Comment les outils **Docker, Jenkins, Kubernetes (Minikube), SonarQube, Prometheus, Grafana** sont reliés entre eux.
- Comment fonctionne le **pipeline CI/CD**.

---

## 1. Vue d’ensemble de l’architecture DevOps

Le projet est découpé en :

- `backend/` : API NestJS qui parle à MongoDB.
- `frontend/` : application React + Vite + Tailwind.
- `docker-compose.yml` (racine) : stack **MongoDB + backend + frontend** en Docker.
- `Jenkinsfile` : pipeline **CI/CD** pour construire, tester et déployer la stack Docker.
- `k8s/` (optionnel) : manifests Kubernetes pour déployer l’app dans **Minikube**.
- Stack de monitoring : **SonarQube**, **Prometheus**, **Grafana** tournent dans des conteneurs/K8s.

Relations principales :

- **Docker** exécute Mongo, backend, frontend, Jenkins, SonarQube.
- **Jenkins** utilise Docker pour builder les images, lancer les tests et déployer via `docker-compose`.
- **SonarQube** reçoit les analyses de code (lançées par Jenkins).
- **Minikube (Kubernetes)** peut exécuter une version “prod locale” de Mongo + backend + frontend.
- **Prometheus** collecte les métriques du cluster K8s, **Grafana** les affiche en dashboards.

---

## 2. Prérequis & environnement

### 2.1. Outils nécessaires

Sur chaque machine :

- Windows 10 / 11
- **WSL2** (Ubuntu recommandé)
- **Docker Desktop** (avec intégration WSL2 activée)
- **Git**

### 2.2. Chemin du projet

- Côté Windows : `C:\Users\amin\Desktop\FrontBackPi\SkillUpTN`
- Côté WSL : `/mnt/c/Users/amin/Desktop/FrontBackPi/SkillUpTN`

Toutes les commandes ci‑dessous sont à exécuter dans **WSL (Ubuntu)**, sauf mention contraire.

---

## 3. Fichiers DevOps importants

### 3.1. À la racine (`SkillUpTN/`)

- `docker-compose.yml`  
  - Lance 3 services Docker :
    - `mongo` : MongoDB (image `mongo:6.0`, port `27017`).
    - `backend` : API NestJS (`skilluptn-ci-cd-backend`, port `3000:3000`).
    - `frontend` : frontend React/Vite (`skilluptn-ci-cd-frontend`, port `80:80`).
  - Sert pour **les développeurs** et pour le déploiement dans le pipeline Jenkins.

- `Dockerfile` (racine)  
  - Optionnel, peut être utilisé pour empaqueter le projet complet.  
  - Le pipeline Jenkins utilise plutôt les Dockerfiles de `backend/` et `frontend/`.

- `Jenkinsfile`  
  - Définit le pipeline CI/CD (stages) exécuté par Jenkins :
    - `Checkout` : clone le repo GitHub.
    - `Build Docker Images` : `docker-compose build` (backend + frontend).
    - `Cleanup Before Deploy` : `docker-compose down -v` (nettoyage ancien déploiement).
    - `Run Backend Tests` : `docker-compose run backend npm run test` (Jest).
    - `Deploy Containers` : `docker-compose up -d --force-recreate`.
    - `Final Cleanup` : `docker system prune -f` (nettoyage images/volumes inutilisés).

- `DEVOPS.md` (ce fichier)  
  - Documentation détaillée de la chaîne DevOps.

### 3.2. Backend (`backend/`)

- `backend/Dockerfile`  
  - Construit l’image backend :
    - Utilise `node:20-alpine`.
    - `npm install`.
    - `npm run build` (Nest build vers `dist/`).
    - Commande finale : `node dist/main` (port 3000).

- `backend/docker-compose.yml`  
  - Fichier de service local Mongo + backend (optionnel, la racine est préférée).

- `backend/package.json`  
  - Scripts clés :
    - `npm run build` : build Nest.
    - `npm run test` : tests unitaires (Jest).
    - `npm run start:dev` : démarrage en mode dev (hors conteneurs).

### 3.3. Frontend (`frontend/`)

- `frontend/Dockerfile`  
  - Multi‑stage :
    - Stage `build` : `npm install` + `npm run build` (Vite → `dist/`).
    - Stage `nginx` : copie `dist/` dans l’image `nginx:alpine` (port 80).

- `frontend/docker-compose.yml`  
  - Optionnel, pour lancer le frontend avec Mongo/backend si nécessaire.

### 3.4. Kubernetes (`k8s/`)

> Ces manifests peuvent être présents ou à recréer. Ils illustrent comment déployer dans Minikube.

- `k8s/namespace.yaml` : crée le namespace `skilluptn`.
- `k8s/mongo.yaml` : `Deployment` + `Service` Mongo dans `skilluptn`.
- `k8s/backend.yaml` : `Deployment` + `Service` backend (image `skilluptn-ci-cd-backend`).
- `k8s/frontend.yaml` : `Deployment` + `Service` frontend (image `skilluptn-ci-cd-frontend`, NodePort pour accès externe).

---

## 4. Docker – Installation, start, stop, ports

### 4.1. Principe

On utilise Docker pour que tous les environnements (dev, CI, K8s) tournent sur les **mêmes images** :

- Backend → image Node NestJS.
- Frontend → image Nginx avec fichiers Vite buildés.
- MongoDB → image officielle.

### 4.2. Construire les images locales

Dans WSL :

```bash
cd /mnt/c/Users/amin/Desktop/FrontBackPi/SkillUpTN
docker-compose build
```

Cela appelle :

- `backend/Dockerfile` → image `skilluptn-ci-cd-backend:latest`.
- `frontend/Dockerfile` → image `skilluptn-ci-cd-frontend:latest`.

### 4.3. Démarrer l’application complète (Docker local)

```bash
cd /mnt/c/Users/amin/Desktop/FrontBackPi/SkillUpTN
docker-compose up -d
docker ps
```

Ports utilisés :

- Frontend : `80` → `http://localhost/`
- Backend : `3000` → `http://localhost:3000`
- MongoDB : `27017` (exposé pour debug éventuel).

### 4.4. Arrêter la stack Docker

```bash
cd /mnt/c/Users/amin/Desktop/FrontBackPi/SkillUpTN
docker-compose down
```

---

## 5. Jenkins – CI/CD (pipeline unique)

### 5.1. Pourquoi Jenkins ?

Au lieu de lancer manuellement `docker-compose build`, `npm test`, etc., Jenkins exécute
ces étapes automatiquement et trace les résultats :

- Build reproductible.
- Tests automatiques (Jest backend).
- Déploiement Docker reproductible.

### 5.2. Lancer Jenkins (une fois)

Dans WSL ou PowerShell :

```bash
docker network create jenkins-net
docker volume create jenkins_home

docker run -d --name jenkins --restart=unless-stopped \
  --network jenkins-net \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts-jdk17
```

Accès : `http://localhost:8080`

### 5.3. Configuration initiale Jenkins

1. Aller sur `http://localhost:8080`.
2. Récupérer le mot de passe admin initial :
   ```bash
   docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. Créer un utilisateur admin Jenkins.
4. Installer les plugins suggérés.

### 5.4. Créer le job pipeline `SkillUpTN-CI-CD`

1. Sur la page d’accueil Jenkins → **New Item** → **Pipeline**.
2. Nom : `SkillUpTN-CI-CD`.
3. Section **Pipeline** :
   - Definition : **Pipeline script from SCM**.
   - SCM : **Git**.
   - Repository URL :  
     `https://github.com/medamin87737/SkillUpTnFrontBack.git`
   - Branches : `*/main`.
   - Script Path : `Jenkinsfile`.

### 5.5. Détail du pipeline (Jenkinsfile)

Le `Jenkinsfile` décrit les étapes DevOps :

1. **stage `Checkout`**
   - Efface le workspace (`deleteDir()`).
   - Clone la branche `main` depuis GitHub.

2. **stage `Build Docker Images`**
   - Commande : `docker-compose build`
   - Raison : construire les images backend/frontend avec les derniers changements.

3. **stage `Cleanup Before Deploy`**
   - Commande : `docker-compose down -v || true`
   - Raison : arrêter et supprimer les anciens conteneurs + volumes, pour repartir proprement.

4. **stage `Run Backend Tests`**
   - Commande : `docker-compose run backend npm run test`
   - Raison : lancer les tests Jest sur l’API NestJS dans un conteneur propre.

5. **stage `Deploy Containers`**
   - Commande : `docker-compose up -d --force-recreate`
   - Raison : démarrer les conteneurs Mongo + backend + frontend avec les nouvelles images.

6. **stage `Final Cleanup`**
   - Commande : `docker system prune -f || true`
   - Raison : nettoyer les images/volumes inutilisés pour limiter l’espace disque.

Post‑actions :

- `success` : log `✅ Pipeline terminé avec succès`.
- `failure` : log `❌ Pipeline échoué`.

### 5.6. Lancer le pipeline

Dans Jenkins, sur le job `SkillUpTN-CI-CD` :

1. Cliquer sur **Build Now**.
2. Ouvrir la **Console Output** pour suivre :
   - `docker-compose build`,
   - tests Jest,
   - `docker-compose up`.

---

## 6. SonarQube – Qualité de code

### 6.1. Rôle

SonarQube est un serveur qui analyse le code source (backend + frontend) pour :

- Bugs potentiels.
- Vulnérabilités.
- Code smells (mauvaise qualité).
- Duplications, complexité, couverture de tests (si configuré).

Le pipeline Jenkins peut appeler SonarQube pour chaque build.

### 6.2. Lancer SonarQube

```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts

# Vérifier
docker ps   # sonarqube doit apparaître
```

Accès : `http://localhost:9000`

### 6.3. Première configuration SonarQube

1. Aller sur `http://localhost:9000`.
2. Login : `admin` / `admin`, puis choisir un nouveau mot de passe.
3. Créer un projet :
   - Project key : `SkillUpTN`
   - Name : `SkillUpTN`
4. Créer un **token d’analyse** (ex : `jenkins-sonar`) et le garder pour la config Jenkins.

### 6.4. Relation Jenkins ↔ SonarQube

1. Jenkins installe le plugin **SonarQube Scanner**.
2. Dans **Manage Jenkins → Configure System → SonarQube servers** :
   - On ajoute un serveur nommé `SonarQube`.
   - URL : `http://host.docker.internal:9000` (vu depuis le conteneur Jenkins).
   - Token : on crée un credential “Secret text” avec le token Sonar.
3. Dans **Global Tool Configuration → SonarQube Scanner** :
   - On configure un scanner nommé `SonarScanner`.
4. Le `Jenkinsfile` peut contenir un stage `SonarQube Analysis` qui :
   - Utilise `withSonarQubeEnv('SonarQube')` pour se connecter.
   - Appelle `sonar-scanner` sur les dossiers `backend` et `frontend`.

Les résultats sont visibles dans l’UI SonarQube pour le projet `SkillUpTN`.

---

## 7. Kubernetes / Minikube – Déploiement “type prod”

### 7.1. Pourquoi Minikube ?

Docker Compose déploie tout sur la même machine, mais sans orchestrateur.
Kubernetes (via Minikube) permet de tester :

- Pods, Services, Deployments.
- Scaling automatique éventuel.
- Intégration avec Prometheus / Grafana.

### 7.2. Démarrer Minikube

```bash
minikube start --driver=docker --cpus=2 --memory=4096mb
kubectl get nodes
```

### 7.3. Construire les images dans l’environnement Minikube

Pour que Minikube trouve les images locales :

```bash
cd /mnt/c/Users/amin/Desktop/FrontBackPi/SkillUpTN

# Basculer le Docker CLI sur le Docker interne de Minikube
eval $(minikube docker-env)

# Re‑construire les images dans le daemon Docker de Minikube
docker build -t skilluptn-ci-cd-backend -f backend/Dockerfile backend
docker build -t skilluptn-ci-cd-frontend -f frontend/Dockerfile frontend
```

### 7.4. Appliquer les manifests K8s (si présents)

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongo.yaml -n skilluptn
kubectl apply -f k8s/backend.yaml -n skilluptn
kubectl apply -f k8s/frontend.yaml -n skilluptn

kubectl get pods -n skilluptn
```

### 7.5. Accéder au frontend via Minikube

```bash
minikube service frontend -n skilluptn --url
```

Cette commande renvoie une URL de type : `http://192.168.49.2:30080` à utiliser dans le navigateur.

---

## 8. Monitoring – Prometheus & Grafana

### 8.1. Rôle

- **Prometheus** : collecte les métriques du cluster (CPU, RAM pods, état, etc.).
- **Grafana** : crée des dashboards pour visualiser ces métriques.

On utilise le chart Helm `kube-prometheus-stack` qui installe l’ensemble :

- Prometheus.
- Grafana.
- Alertmanager.
- Exporters / kube-state-metrics.

### 8.2. Installer le stack de monitoring

```bash
kubectl create namespace monitoring

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring

kubectl get pods -n monitoring
```

### 8.3. Accéder à Grafana

```bash
# Récupérer le mot de passe admin
kubectl get secret -n monitoring monitoring-grafana \
  -o jsonpath="{.data.admin-password}" | base64 -d
echo

# Port-forward depuis K8s vers la machine locale
kubectl port-forward -n monitoring svc/monitoring-grafana 32000:80
```

Dans le navigateur : `http://localhost:32000`  
Login : `admin` / mot de passe décodé.

### 8.4. Accéder à Prometheus

```bash
kubectl port-forward -n monitoring \
  svc/monitoring-kube-prometheus-prometheus 32010:9090
```

Dans le navigateur : `http://localhost:32010`

### 8.5. Exemple de métriques utiles

Dans Prometheus (UI) :

- État des pods SkillUpTN :
  ```promql
  kube_pod_container_status_ready{namespace="skilluptn"}
  ```
- CPU pods SkillUpTN :
  ```promql
  rate(container_cpu_usage_seconds_total{namespace="skilluptn"}[5m])
  ```
- Mémoire pods SkillUpTN :
  ```promql
  container_memory_working_set_bytes{namespace="skilluptn"}
  ```

Dans Grafana :

- Utiliser les dashboards pré‑configurés : “Kubernetes / Compute Resources / Pod”.
- Filtrer sur `namespace = skilluptn` et `pod = backend-...` ou `frontend-...`.

---

## 9. Résumé des commandes start / stop

### 9.1. Application Docker (Mongo + API + UI)

```bash
cd /mnt/c/Users/amin/Desktop/FrontBackPi/SkillUpTN

# Start
docker-compose up -d

# Stop
docker-compose down
```

### 9.2. Jenkins & SonarQube

```bash
# Start
docker start jenkins sonarqube

# Stop
docker stop jenkins sonarqube
```

### 9.3. Minikube

```bash
minikube start    # démarrer le cluster local
minikube stop     # arrêter le cluster
```

### 9.4. Monitoring (port-forward)

```bash
# Grafana
kubectl port-forward -n monitoring svc/monitoring-grafana 32000:80
# → http://localhost:32000

# Prometheus
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 32010:9090
# → http://localhost:32010
```

---

## 10. URLs pour tester l’application & les outils

- **Frontend (Docker)** : `http://localhost/`
- **Backend API (Docker)** : `http://localhost:3000`
- **Frontend (Minikube)** : `minikube service frontend -n skilluptn --url`
- **Jenkins** : `http://localhost:8080`
- **SonarQube** : `http://localhost:9000`
- **Grafana** : `http://localhost:32000`
- **Prometheus** : `http://localhost:32010`

Ce fichier peut être partagé directement à l’équipe pour les guider dans
l’installation et l’utilisation de toute la chaîne DevOps autour de SkillUpTN.

