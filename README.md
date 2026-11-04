# JUPITER Project Manager

JUPITER Project Manager est une plateforme de gestion de projets collaboratifs permettant aux équipes de planifier, suivre et gérer leurs projets de manière efficace.
Cette nouvelle version est entièrement **Dockerisée** et utilise **PostgreSQL** pour la persistance des données et **MinIO** pour le stockage des ressources S3-compatibles.

## 🚀 Démarrage Rapide

### Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installé et en cours d'exécution.

### Installation

1.  **Copier l'environnement** :
    ```powershell
    cp .env.example .env
    ```

2.  **Lancer l'application** :
    ```powershell
    docker compose up -d
    ```
    *Cette commande télécharge les images, crée les containers et initialise les services (Base de données, Stockage, Backend, Frontend).*

3.  **Initialiser la base de données** (Optionnel - Déjà fait lors de la migration) :
    ```powershell
    docker exec jupiter_backend npx sequelize-cli db:migrate
    docker exec jupiter_backend npx sequelize-cli db:seed:all
    ```

## 🔑 Identifiants de Test

L'application est pré-remplie avec des données de démonstration :

### Interface Utilisateur (Port 3000)
- **Utilisateur Standard** :
  - **Email** : `adel.jupiter@gmail.com`
  - **Mot de passe** : `ùser@del123`
- **Administrateur** :
  - **NomAdmin** : `admin`
  - **Mot de passe** : `admin123`


### MinIO Console (Port 9001)
- **Login** : `minioadmin` (ou la valeur dans votre `.env`)
- **Password** : `minioadmin` (ou la valeur dans votre `.env`)

## 🏗 Architecture Modernisée

- **Frontend** : React (Port 3000) - Optimisé pour la production dans Nginx.
- **Backend** : Node.js/Express (Port 5000) - Gestion des APIs et Socket.io.
- **Base de Données** : PostgreSQL (Port 5432) - Gérée via migrations Sequelize.
- **Stockage** : MinIO (API: 9000, Console: 9001) - Stockage sécurisé par URLs signées.

## 🛠 Commandes Utiles

- **Voir les logs** : `docker compose logs -f`
- **Arrêter tout** : `docker compose down`
- **Reconstruire les images** : `docker compose up -d --build`

## 👥 Auteurs

- **BERKATI Farah** - Développeur Frontend
- **BENYOUB Adel** - Développeur Backend

---
*Projet réalisé dans le cadre du Master Génie Logiciel.*
