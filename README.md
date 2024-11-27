# JUPITER Project Manager

JUPITER Project Manager est une plateforme de gestion de projets collaboratifs. Elle permet aux équipes de planifier, suivre et gérer leurs projets de manière efficace. JPM est basé sur le processus unifié (UP) et utilise le modèle de conception MVC, avec une implémentation utilisant la pile SERN (SQL, Express, React, Node.js).

## Fonctionnalités

- **Gestion des projets** : Création, modification et suppression de projets.
- **Gestion des tâches** : Ajout, assignation, suivi et clôture des tâches.
- **Ressources** : Ajout, modification et suppression de fichiers (pdf, txt, word, ppt et bien d'autres).
- **Gestion des utilisateurs** : Enregistrement, authentification et gestion des rôles des utilisateurs.
- **Tableaux de bord** : Visualisation des progrès des projets et des tâches en cours.
- **Notifications** : Alertes et rappels pour les échéances et les mises à jour des tâches.
- **Message** : Messagerie instantané.

## Installation

1. Clonez le dépôt :

    ```sh
    git clone https://github.com/Adelbenyoub99/jupiter-project-manager.git
    ```

2. Accédez au répertoire du projet :

    ```sh
    cd jupiter-project-manager
    ```

3. Installez les dépendances backend et frontend :

    ```sh
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

4. Configurez la base de données dans le fichier de configuration `config.js` situé dans le répertoire `backend`.

5. Démarrez le serveur backend :

    ```sh
    cd backend
    npm start
    ```

6. Démarrez l'application frontend :

    ```sh
    cd frontend
    npm start
    ```

7. Ouvrez votre navigateur et accédez à `http://localhost:3000` pour utiliser l'application.

## Structure du projet

- **backend/** : Contient le code source du serveur Node.js/Express et les fichiers de configuration de la base de données.
- **frontend/** : Contient le code source de l'application React.
- **docs/** : Contient la documentation technique et les guides d'utilisation.

## Contribuer

1. Forkez le dépôt.
2. Créez une branche pour vos modifications :

    ```sh
    git checkout -b feature/nom_de_votre_fonctionnalite
    ```

3. Commitez vos modifications :

    ```sh
    git commit -m "Ajout d'une nouvelle fonctionnalité"
    ```

4. Poussez vos modifications sur votre dépôt forké :

    ```sh
    git push origin feature/nom_de_votre_fonctionnalite
    ```

5. Ouvrez une Pull Request pour fusionner vos modifications dans le dépôt principal.

## Auteurs

- **BERKATI Farah** - Développeur Frontend - [Profil GitHub](https://github.com/F-Joy)
- **BENYOUB Adel** - Développeur Backend - [Profil GitHub](https://github.com/Adelbenyoub99)

## Remerciements

- Merci à M. ALLEM KHALED pour l'encadrement et les conseils.
