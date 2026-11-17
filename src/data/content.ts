/**
 * TOUT LE TEXTE DU SITE EN FRANÇAIS EST ICI (la version anglaise est dans content.en.ts).
 * Modifie ce fichier pour changer une phrase, ajouter un projet ou une compétence :
 * le site se met à jour tout seul (npm run dev).
 * Pense à faire la même modification dans content.en.ts.
 */
import type { LogoName } from '../components/Logo';

export const person = {
  firstName: 'Ayoub',
  lastName: 'El Maftah',
  title: 'Développeur en formation',
  status: 'Recherche un stage de 10 semaines · mars → mai 2027',
  school: 'IUT de Blagnac',
  location: 'Blagnac, Toulouse',
  email: 'elmaftah.ayoub@gmail.com',
  github: 'https://github.com/ayoub-elmaftah',
  linkedin: 'https://www.linkedin.com/in/ayoub-el-maftah-909993396/',
  // Fichier à placer dans public/cv/ (laisse '' pour cacher le bouton)
  cv: 'cv/CV-Ayoub-El-Maftah.pdf',
};

export const nav = [
  { id: 'profil', label: 'Profil' },
  { id: 'projets', label: 'Projets' },
  { id: 'competences', label: 'Compétences' },
  { id: 'formation', label: 'Formation' },
  { id: 'contact', label: 'Contact' },
];

// Le paragraphe d'accroche de l'accueil
export const intro =
  "Étudiant en 2e année de BUT Informatique à l'IUT de Blagnac. J'aime construire des choses qui tournent vraiment : des applications Java avec leur base de données, des sites web et des petits jeux.";

// Les lignes tapées dans le terminal de l'accueil
export const terminal: { cmd: string; out: string[] }[] = [
  { cmd: 'whoami', out: ['Ayoub El Maftah · BUT Info 2e année'] },
  { cmd: 'cat stack.txt', out: ['Java · JavaFX · Oracle SQL · PL/SQL', 'HTML · CSS · JS · PHP · Python'] },
  { cmd: 'cat dispo.txt', out: ['stage : 08/03/2027 → 16/05/2027', 'zone  : Blagnac · Toulouse'] },
];

export const about = {
  title: 'Qui je suis',
  paragraphs: [
    "L'informatique me passionne depuis le lycée, où j'ai suivi la spécialité NSI. J'ai choisi le BUT Informatique pour en faire mon métier, et ce qui me plaît le plus, c'est le développement web et les bases de données : concevoir une interface claire et organiser les données qui la font tourner.",
    "Curieux et rigoureux, j'aime comprendre comment les choses fonctionnent et les construire moi-même. Je cherche aujourd'hui un stage pour mettre ces compétences en pratique au sein d'une équipe.",
  ],
  facts: [
    { label: 'Formation', value: 'BUT Informatique', detail: 'IUT de Blagnac, 2025 – 2028' },
    { label: 'Langues', value: 'Français · Anglais C1', detail: 'Espagnol B2 · Arabe (bilingue)' },
    { label: 'Localisation', value: 'Blagnac', detail: 'Permis B · Toulouse en transports' },
    { label: 'Centres d’intérêt', value: 'Sport · Jeux vidéo', detail: 'Parfumerie' },
  ] as { label: string; value: string; detail?: string }[],
};

/* ---------- Expérience professionnelle ----------
 * Vide pour l'instant : la section n'apparaît pas tant que la liste est vide.
 * Après ton stage, ajoute un bloc ici et 'experience' dans nav.
 */
export type Job = { role: string; company: string; type: string; dates: string; points: string[] };
export const experiences: Job[] = [];

/* ---------- Projets ----------
 * category : sert aux filtres au-dessus des cartes
 * tech : logos affichés sur la carte (noms de la liste LogoName dans components/Logo.tsx)
 * link : facultatif, par exemple le dépôt GitHub du projet
 * featured : true = carte large en haut
 */
// Le premier élément est le filtre « tout afficher »
export const categories: string[] = ['Tous', 'Application', 'Conception', 'Données', 'Jeu vidéo', 'Web'];

export type Project = {
  category: string;
  title: string;
  context?: string;
  description: string;
  highlights?: string[];
  tech?: LogoName[];
  link?: { label: string; href: string };
  featured?: boolean;
  playable?: boolean; // affiche le bouton « Jouer » (mini-Sokoban)
};

export const projects: Project[] = [
  {
    category: 'Application',
    title: 'LiveTournois',
    context: 'Projet en équipe de 3 · chef de projet',
    description: "Application de gestion de tournois e-sport : équipes, jeux, matchs et résultats, avec une base de données Oracle.",
    highlights: [
      'Chef de projet : répartition des tâches, suivi de l’équipe sur Git',
      'Architecture MVC (DAO, services, contrôleurs) et interface JavaFX / Scene Builder',
      'Base Oracle modélisée et requêtée, export PDF avec iText',
    ],
    tech: ['Java', 'JavaFX', 'Oracle', 'Maven', 'Git'],
    featured: true,
  },
  {
    category: 'Conception',
    title: 'Recueil des besoins d’un client',
    context: 'Projet en équipe de 3 · analyse des besoins',
    description: "Comprendre le besoin d'une entreprise cliente et y répondre par une solution. Le besoin : simplifier la réservation des bureaux en open space (flex office), avec une réservation en une action, la validation de présence à l'arrivée et le suivi du taux d'occupation.",
    highlights: [
      'Échanges avec le client et reformulation de ses attentes pour l’équipe',
      'User stories, cas d’utilisation UML, personas, user flows',
      'Exigences classées par priorité : exprimées, latentes, indifférentes, inversées',
    ],
  },
  {
    category: 'Données',
    title: 'Bases de données Oracle',
    context: 'Deux projets · en trinôme puis en binôme',
    description: "D'abord, création complète de la base d'un site e-commerce. Ensuite, reprise d'une base existante : repérage de ses défauts de conception, nouveau schéma et requêtes d'analyse des ventes.",
    highlights: [
      'Dictionnaire de données, UML (Win’Design), schéma relationnel',
      'Scripts SQL avec contraintes : clés, CHECK, UNIQUE',
      'Requêtes d’analyse : livraisons partielles, montants HT/TTC, chiffre d’affaires',
    ],
    tech: ['Oracle', 'SQL'],
  },
  {
    category: 'Jeu vidéo',
    title: 'Sokoban',
    context: 'Projet individuel · interface graphique',
    description: "Jeu de réflexion en JavaFX avec 10 niveaux de tailles différentes, construit en séparant la logique du jeu (modèle) de l'interface (FXML et contrôleur).",
    highlights: [
      'Lecteur de fichiers .xsb : import de nouvelles banques de niveaux sans relancer le jeu',
      'Détection automatique des blocages quand une caisse est coincée dans un coin',
      'Grille recalculée en temps réel quand on redimensionne la fenêtre',
      'Historique des coups pour annuler, meilleurs scores sauvegardés dans un fichier',
      'Personnage qui change d’image selon sa direction',
    ],
    tech: ['Java', 'JavaFX', 'Maven'],
    playable: true,
  },
  {
    category: 'Web',
    title: 'La Trattoria, site de pizzeria',
    context: 'Projet en binôme',
    description: "Site vitrine de 5 pages pour une pizzeria toulousaine : accueil avec vidéo en fond, carte de 13 pizzas, avis clients, horaires et formulaire de contact.",
    highlights: ['Mise en page adaptée au mobile', 'Carte Google Maps intégrée', 'Mis en ligne sur GitLab Pages'],
    tech: ['HTML', 'CSS'],
    link: { label: 'Voir le site', href: 'https://ayoub-b749a8.gitlab.io/' },
  },
];

/* ---------- Formation : du plus récent au plus ancien ---------- */
export type Step = { years: string; title: string; place: string; text?: string; current?: boolean };

export const education: Step[] = [
  {
    years: '2025 – 2028',
    title: 'BUT Informatique',
    place: 'IUT de Blagnac · Université Toulouse Jean Jaurès',
    text: "2e année en cours. Développement Java, bases de données, gestion de projet, conception d'interfaces et qualité logicielle.",
    current: true,
  },
  { years: '2022 – 2025', title: 'Baccalauréat général', place: 'Lycée Jules Guesde, Montpellier', text: 'Spécialités mathématiques et NSI (numérique et sciences informatiques).' },
];

/* ---------- Parcours : la ligne de métro de la section Formation (dans l'ordre) ----------
 * etat : 'fait' (station allumée), 'en-cours' (station actuelle), 'a-venir' (pointillés)
 */
export type Station = { annee: string; titre: string; lieu: string; detail?: string; etat: 'fait' | 'en-cours' | 'a-venir' };

export const parcours: Station[] = [
  { annee: '2022 – 2025', titre: 'Bac général', lieu: 'Lycée Jules Guesde, Montpellier', detail: 'Spécialités maths et NSI', etat: 'fait' },
  { annee: 'Sept. 2025', titre: 'BAFA', lieu: 'Brevet d’animateur', detail: 'Animation et encadrement de groupes', etat: 'fait' },
  { annee: '2025 – 2028', titre: 'BUT Informatique', lieu: 'IUT de Blagnac', detail: '2e année en cours', etat: 'en-cours' },
  { annee: 'Mars → mai 2027', titre: 'Stage', lieu: 'Toulouse et alentours', detail: '10 semaines · je cherche !', etat: 'a-venir' },
  { annee: '2028', titre: 'Diplôme', lieu: 'BUT Informatique', etat: 'a-venir' },
];

/* ---------- Compétences ---------- */
// Les outils avec un logo (voir components/Logo.tsx pour la liste des logos disponibles)
export const toolGroups: { title: string; items: LogoName[] }[] = [
  { title: 'Langages', items: ['Java', 'Python', 'Bash'] },
  { title: 'Web', items: ['HTML', 'CSS', 'JavaScript', 'PHP'] },
  { title: 'Données', items: ['Oracle', 'SQL'] },
  { title: 'Outils', items: ['Git', 'Maven', 'VS Code'] },
];

// Les compétences sans logo
export const otherSkills = [
  { title: 'Méthodes', items: ['Recueil de besoins', 'Gestion de projet', 'Cahier des charges', 'UML', 'Tests JUnit'] },
  { title: 'Savoir-être', items: ['Organisé et rigoureux', 'Persévérant', 'À l’écoute', 'Travail en équipe', 'Encadrement de groupes (BAFA)'] },
  { title: 'Langues', items: ['Français', 'Anglais C1', 'Espagnol B2', 'Arabe (bilingue)'] },
];

export const contact = {
  sentence: 'Je cherche un stage de 10 semaines du 8 mars au 16 mai 2027, autour de Toulouse. Une offre, un projet ou une question : écris-moi.',
};

/* ---------- Petits textes de l'interface (boutons, titres de sections…) ---------- */
export const ui = {
  skip: 'Aller au contenu',
  contactBtn: 'Me contacter',
  menuOpen: 'Ouvrir le menu',
  menuClose: 'Fermer le menu',
  backTop: 'retour en haut',
  themeLight: 'Passer en mode clair',
  themeDark: 'Passer en mode sombre',
  langSwitch: 'Read in English',
  heroProjects: 'Voir mes projets',
  heroCv: 'Télécharger mon CV',
  heroBadge: 'Formation',
  scrollDown: 'Descendre vers le profil',
  terminalLabel: 'Présentation façon terminal',
  profileLabel: 'Profil',
  photoAlt: 'Portrait d’Ayoub El Maftah',
  projectsLabel: 'Projets',
  projectsTitle: 'Ce que j’ai construit',
  projectsIntro: 'Des projets réalisés à l’IUT de Blagnac, seul ou en équipe.',
  projectsFilter: 'Filtrer les projets',
  play: '▶ Jouer une partie',
  closeGame: '■ Fermer le jeu',
  loading: 'Chargement…',
  experienceLabel: 'Expérience',
  experienceTitle: 'Expérience professionnelle',
  skillsLabel: 'Compétences',
  skillsTitle: 'Ma boîte à outils',
  educationLabel: 'Formation',
  educationTitle: 'Mon parcours',
  educationIntro: 'Prochain arrêt : un stage de 10 semaines, à partir du 8 mars 2027.',
  contactLabel: 'Contact',
  contactTitle: 'Un stage à proposer ?',
  copy: 'Copier l’adresse',
  copied: 'Adresse copiée',
  copiedSr: 'Adresse e-mail copiée',
  rights: 'Tous droits réservés.',
  top: 'Retour en haut',
  soko: {
    levels: ['Pousser une caisse', 'Tourner autour', 'Petit obstacle', 'Trois caisses'],
    level: 'Niveau',
    moves: 'coups',
    pushes: 'poussées',
    undo: '↶ Annuler',
    restart: '↻ Recommencer',
    prev: 'Niveau précédent',
    next: 'Niveau suivant',
    hint: 'Flèches ou ZQSD · glisser sur mobile · Ctrl+Z annuler · R recommencer',
    aria: 'Mini-jeu Sokoban : flèches ou ZQSD pour bouger, Ctrl+Z pour annuler, R pour recommencer',
    win: 'Niveau réussi !',
    nextBtn: 'Niveau suivant →',
    allDone: 'Tous les niveaux sont finis, bravo !',
    stuck: 'Bloqué !',
    stuckMsg: 'Une caisse est coincée.',
    undoMove: 'Annuler le coup',
    restartBtn: 'Recommencer',
    soundOn: 'Couper le son',
    soundOff: 'Activer le son',
  },
};

export const fr = { person, nav, intro, terminal, about, experiences, categories, projects, parcours, toolGroups, otherSkills, contact, ui };
export type Content = typeof fr;
