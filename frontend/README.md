# TIA INFO BUILD - Frontend

Application de gestion intégrée des activités BTP.

## Technologies

- React 18
- React Router v6
- Axios
- Vite
- CSS Pur (Vanilla CSS)
- Chart.js

## Installation

1. Clonez le dépôt
2. Installez les dépendances: `npm install`
3. Copiez le fichier `.env.example` vers `.env`
4. Lancez le serveur de développement: `npm run dev`

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile pour la production
- `npm run preview` - Prévisualise la version compilée
- `npm run lint` - Vérifie le code avec ESLint
- `npm run format` - Formate le code avec Prettier

## Structure du projet


src/
├── api/ # Appels API
├── components/ # Composants réutilisables
├── pages/ # Pages de l'application
├── hooks/ # Hooks personnalisés
├── context/ # Context API
├── utils/ # Utilitaires
├── styles/ # Styles globaux
└── routes/ # Configuration des routes

text

## Variables d'environnement

- `VITE_API_URL` - URL de l'API backend
- `VITE_APP_NAME` - Nom de l'application
- `VITE_RECAPTCHA_SITE_KEY` - Clé reCAPTCHA

## Licence

Tous droits réservés - TIA INFO BUILD