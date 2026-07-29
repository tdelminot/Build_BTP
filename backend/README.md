# TIA INFO BUILD - Backend API

API RESTful pour la gestion intégrée des activités BTP.

## Technologies
- Node.js
- Express
- Sequelize
- MySQL
- JWT pour l'authentification

## Installation

1. Cloner le dépôt
2. Installer les dépendances: `npm install`
3. Configurer le fichier `.env`
4. Créer la base de données MySQL
5. Lancer les migrations: `npm run migrate`
6. Lancer les seeders: `npm run seed` (optionnel)
7. Démarrer le serveur: `npm run dev`

## Scripts disponibles

- `npm start` - Démarrer en production
- `npm run dev` - Démarrer en développement avec nodemon
- `npm run migrate` - Exécuter les migrations
- `npm run seed` - Exécuter les seeders
- `npm test` - Lancer les tests

## Structure de l'API

- `/api/v1/auth` - Authentification
- `/api/v1/projects` - Gestion des projets
- `/api/v1/employees` - Gestion des employés
- `/api/v1/dashboard` - Tableau de bord
- `/api/health` - Health check

## Sécurité

- Helmet pour les headers HTTP
- CORS configuré
- Rate limiting
- Protection XSS
- Validation des entrées
- JWT pour l'authentification
- reCAPTCHA pour les formulaires sensibles

## Variables d'environnement

Voir le fichier `.env.example`