# Instructions pour lancer l'application React

## 1. Installer les dépendances (une seule fois)
```bash
cd centrale-diass
npm install
npm install chart.js
```

## 2. Copier les fichiers src/
Remplacez tout le contenu de votre dossier `src/` par les fichiers fournis :
- src/App.jsx
- src/Dashboard.jsx
- src/api.js
- src/components/Login.jsx
- src/components/KPI.jsx
- src/components/Onduleur.jsx
- src/components/Graphique.jsx

## 3. Lancer l'application
Terminal 1 — API FastAPI :
```bash
cd backend
py -m uvicorn main:app --reload
```

Terminal 2 — React :
```bash
cd centrale-diass
npm run dev
```

## 4. Ouvrir dans le navigateur
http://localhost:5173

## Comptes de test
- admin / diass2024
- manager / senelec123
