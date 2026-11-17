# Ayoub El Maftah · Portfolio

**👉 [ayoub-elmaftah.github.io](https://ayoub-elmaftah.github.io)**

Mon portfolio d'étudiant en 2e année de BUT Informatique à l'IUT de Blagnac. J'y présente mes projets, mes compétences et mon parcours. Je cherche un **stage de 10 semaines du 8 mars au 16 mai 2027**, autour de Toulouse.

## Ce qu'il y a dedans

- **Version française et anglaise** : bouton FR / EN, la langue du navigateur est choisie à la première visite
- **Thème sombre et clair**
- **Sokoban jouable** dans la carte du projet, avec annulation des coups, détection des blocages et bruitages
- **Ligne de métro animée** pour le parcours, qui avance avec le défilement
- **Terminal** qui tape une présentation à l'accueil
- Adapté au mobile, et accessible au clavier

## Technologies

React 19 · TypeScript · Vite · Tailwind CSS · Motion (animations)

Le site est publié automatiquement sur GitHub Pages par une GitHub Action à chaque modification de la branche `main`.

## Lancer le projet

Il faut Node.js 20 ou plus.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # version de production dans dist/
```

## Organisation

| Dossier / fichier | Rôle |
| --- | --- |
| `src/data/content.ts` | Tous les textes en français |
| `src/data/content.en.ts` | Les mêmes textes en anglais |
| `src/sections/` | Les sections de la page (accueil, profil, projets…) |
| `src/components/` | Terminal, Sokoban, ligne de métro, boutons… |
| `public/cv/` | Le CV téléchargeable |

## Contact

[elmaftah.ayoub@gmail.com](mailto:elmaftah.ayoub@gmail.com) · [LinkedIn](https://www.linkedin.com/in/ayoub-el-maftah-909993396/)
