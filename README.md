# THP

Depot central de suivi du cursus THP.

Ce repo regroupe progressivement les projets et exercices realises pendant le
cursus. Chaque module est ajoute au fur et a mesure, afin de conserver une
structure lisible sans creer a l'avance des dossiers vides.

## Organisation

- `ModulesFront/` : modules, projets et exercices front-end.
- `docs/` : portail public deploye avec GitHub Pages.
- `.github/workflows/pages.yml` : workflow de construction et de publication GitHub Pages.

## GitHub Pages

Le depot publie un portail GitHub Pages via GitHub Actions. Le portail liste les
projets disponibles et pointe vers les dossiers publics generes dans l'artefact
Pages.

### Ajouter un projet statique

1. Ajouter le projet dans `ModulesFront/`.
2. Verifier que le projet expose un `index.html` dans son dossier.
3. Utiliser des chemins relatifs pour les fichiers CSS et JavaScript.
4. Ajouter une carte dans `docs/index.html` avec un lien relatif :

```text
./ModulesFront/Module-XX-nom-du-module/nom-du-projet/
```

### Ajouter un projet avec build

Pour un projet Webpack, Vite, React ou equivalent :

1. Ne pas committer `dist/`.
2. Configurer les assets en chemins relatifs :
   - Webpack : `publicPath: "./"` ;
   - Vite : `base: "./"`.
3. Ajouter dans `.github/workflows/pages.yml` les etapes `npm ci` et
   `npm run build`.
4. Copier le contenu de `dist/` vers le dossier final dans `_site/`.
5. Pour une SPA, preferer des routes hash (`#/...`) afin d'eviter les 404 au
   rechargement sur GitHub Pages.

### Cles API temporaires

Les demos Pages peuvent utiliser une cle API publique temporaire lorsque c'est
utile pour la presentation. La cle ne doit pas etre committee : elle doit etre
declaree dans GitHub Actions.

Convention :

```text
MODULE_XX_PROJECT_API_KEY
MODULE_XX_PROJECT_API_ENABLED
```

Si `*_API_ENABLED=false` ou si le secret est absent, le workflow genere une
configuration vide et le projet reste en mode degrade. Apres la revue ou la
correction, desactiver la demo en passant `*_API_ENABLED=false` ou en supprimant
le secret, puis relancer le workflow Pages.

## Convention de commits

Les commits indiquent le projet ou l'exercice concerne dans le scope :

```txt
feat(loto-js): add module 01 project structure
fix(tic-tac-toe): prevent invalid board position
docs(week-05): add project notes
refactor(rpg): simplify enemy spawn logic
style(calculator): improve button layout
```
