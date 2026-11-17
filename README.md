# Portfolio d'Ayoub El Maftah

Site d'une page en **React**, **TypeScript**, **Tailwind CSS** et **Motion** (animations), lancé avec **Vite**.
Style : sombre et moderne par défaut (mode clair avec le bouton en haut), accent violet + vert « terminal », polices Space Grotesk et JetBrains Mono.

## Lancer le site

Il faut **Node.js 20 ou plus** (`node -v` pour vérifier).

```bash
npm install     # une seule fois
npm run dev     # puis ouvre http://localhost:5173
```

## À compléter avant de mettre en ligne

Tout le texte est dans `src/data/content.ts` (français) et `src/data/content.en.ts` (anglais). Quand tu changes une phrase, change-la dans les deux :

- ton lien **GitHub** et ton lien **LinkedIn**
- la ligne du **baccalauréat** (spécialités, mention)
- les liens `link` des projets si tu les mets sur GitHub
- ton **CV** : place le PDF dans `public/cv/CV-Ayoub-El-Maftah.pdf` (ou mets `cv: ''` pour cacher le bouton)

## Où modifier quoi

| Je veux changer…                             | Fichier |
| -------------------------------------------- | ------- |
| Un texte, un projet, une compétence, le terminal de l'accueil | `src/data/content.ts` + `src/data/content.en.ts` |
| L'image d'aperçu quand on partage le lien | `public/og.png` (1200 × 630) |
| Ajouter une expérience (après ton stage)     | `experiences` dans `content.ts` + `{ id: 'experience', label: 'Expérience' }` dans `nav` |
| Ajouter un logo de langage / outil           | `src/components/Logo.tsx` (liste : https://devicon.dev) |
| Les couleurs                                 | `src/index.css`, bloc `@theme` (clair) et `.dark` (sombre) |
| La mise en page d'une section                | `src/sections/` |

Pour ajouter un projet : copie un bloc `{ category: 'Application', … }` dans `projects`. Les filtres au-dessus des cartes se basent sur `category`. Mets `featured: true` pour une carte en pleine largeur.

## Mettre le site en ligne (GitHub Pages, gratuit)

1. Sur GitHub, crée un dépôt **public** nommé `<ton-pseudo>.github.io`.
2. Envoie-y le contenu de ce dossier (VS Code : **Contrôle de code source > Publier sur GitHub**).
3. Dans le dépôt : **Settings > Pages > Source : GitHub Actions**.
4. À chaque push sur `main`, le site est reconstruit et mis en ligne sur `https://<ton-pseudo>.github.io`.

## Autres commandes

- `npm run build` : version finale dans `dist/`
- `npm run preview` : affiche cette version finale en local
