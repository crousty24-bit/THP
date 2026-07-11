# Cahier des charges — Diff Impact Analyzer

## 1. Contexte

Les développeurs et les agents IA peuvent produire des changements plus larges,
plus dispersés ou plus sensibles que prévu. La commande `git diff` fournit la
matière brute, mais elle ne synthétise pas la portée du changement et ne met pas
en évidence les facteurs qui devraient orienter la revue.

Diff Impact Analyzer doit analyser localement les changements Git non indexés
ou indexés, calculer des métriques objectives, détecter des signaux de vigilance
et produire un score expliqué. Il doit aider l'utilisateur à décider où porter
son attention avant un commit ou un push.

Le produit ne mesure pas la qualité intrinsèque du code. Il est complémentaire
à Code Quality Guardian, qui traite les règles de qualité et de maintenance.

## 2. Objectifs

### Objectif principal

Transformer les métadonnées d'un diff Git local en un rapport lisible,
reproductible et explicable sur la portée et le risque du changement.

### Objectifs secondaires

- fournir le même résultat depuis une CLI et une interface web locale ;
- permettre la vérification de chaque point du score ;
- fonctionner sans transmettre le code ou le diff à un service distant ;
- produire une base réutilisable ultérieurement dans une GitHub Action ou un
  hook Git.

### Non-objectifs

- décider si une modification est correcte ;
- évaluer le style ou la qualité du code ;
- comprendre la logique métier ;
- exécuter le code ou les tests du dépôt ;
- prédire avec certitude une régression.

## 3. Public cible

### Persona principal — Alex, développeur junior

Alex utilise Git au quotidien, mais manque encore de méthode pour évaluer la
portée d'une modification. Avant de committer, il veut savoir si son changement
touche plus de fichiers ou de domaines que prévu et comprendre les raisons d'un
niveau de vigilance élevé.

### Persona secondaire — Sam, reviewer

Sam relit des changements produits par des collègues ou des agents IA. Avant de
lire chaque hunk, Sam veut une vue d'ensemble chiffrée et une liste de fichiers
sensibles à examiner en priorité.

## 4. Périmètre du MVP

### Inclus

- Analyse du working tree, équivalente à `git diff`.
- Analyse de l'index, équivalente à `git diff --cached`.
- Choix du dépôt par option CLI et au démarrage du serveur.
- Vérification que le chemin cible appartient à un dépôt Git.
- Détection des fichiers ajoutés, modifiés, supprimés ou renommés lorsque Git
  fournit ce statut.
- Comptage des fichiers et des lignes ajoutées ou supprimées.
- Détection des domaines de premier niveau et des types de fichiers.
- Détection de catégories de fichiers sensibles.
- Calcul d'un score fixe entre 0 et 100.
- Verdict Faible, Moyen ou Élevé et résumé déterministe.
- Rapport CLI texte ou Markdown.
- Interface React affichant le dépôt, le mode, les métriques, les fichiers, les
  signaux et le verdict.
- Gestion des états vide, chargement, aucun changement et erreur.

### Exclu

- Fichiers Git non suivis.
- Comparaison avec une branche distante ou une pull request.
- GitHub Action et hooks Git.
- Export direct vers un fichier.
- Persistance ou historique des rapports.
- Authentification et gestion d'utilisateurs.
- Configuration personnalisée des règles et seuils.
- Base de données.
- Appel à une IA pendant l'analyse.
- Analyse sémantique du contenu du code.

## 5. User stories et critères d'acceptation

### US1 — Analyser les changements non indexés

> En tant que développeur, je veux analyser mon working tree afin de mesurer la
> portée des changements qui ne sont pas encore indexés.

Critères d'acceptation :

- sans option `--staged`, la CLI analyse le même périmètre que `git diff` ;
- l'interface propose le mode « Non indexé » ;
- les fichiers non suivis ne sont pas ajoutés au résultat ;
- un working tree sans changement produit un rapport vide valide, sans erreur.

### US2 — Analyser les changements indexés

> En tant que développeur, je veux analyser l'index afin de vérifier ce que je
> m'apprête à committer.

Critères d'acceptation :

- l'option `--staged` analyse le même périmètre que `git diff --cached` ;
- l'interface propose le mode « Indexé » ;
- un changement uniquement présent dans le working tree est absent de cette
  analyse.

### US3 — Comprendre les métriques

> En tant que reviewer, je veux voir les fichiers, lignes, domaines et types
> impactés afin d'estimer rapidement l'étendue du changement.

Critères d'acceptation :

- les lignes d'en-tête Git ne sont pas comptées comme du contenu ;
- `lignes modifiées = ajouts + suppressions` ;
- un fichier à la racine appartient au domaine `(root)` ;
- un fichier sans extension appartient au type `[no extension]` ;
- un fichier binaire est compté comme fichier, avec des compteurs de lignes
  indisponibles.

### US4 — Comprendre le score

> En tant que développeur, je veux voir les signaux et leurs points afin de
> vérifier le verdict sans faire confiance à une boîte noire.

Critères d'acceptation :

- chaque signal indique son identifiant, sa raison et ses points ;
- le total est la somme des composantes après application des plafonds ;
- le score final est plafonné à 100 ;
- le même rapport produit toujours le même score ;
- le verdict correspond exactement aux seuils documentés.

### US5 — Utiliser la CLI

> En tant que développeur, je veux obtenir le rapport dans mon terminal afin de
> l'intégrer à mon flux Git habituel.

Critères d'acceptation :

- le format texte est utilisé par défaut ;
- le format Markdown est sélectionnable ;
- le rapport est écrit sur stdout et les erreurs sur stderr ;
- les arguments invalides et les erreurs Git retournent un code de sortie non
  nul.

### US6 — Utiliser l'interface locale

> En tant que développeur, je veux visualiser le rapport dans une interface afin
> de parcourir facilement les métriques et les fichiers.

Critères d'acceptation :

- le chemin du dépôt et la branche sont affichés en lecture seule ;
- l'utilisateur peut choisir le mode puis lancer l'analyse ;
- une nouvelle analyse remplace le résultat courant sans être persistée ;
- les erreurs réseau et Git sont affichées sans casser l'interface ;
- le niveau de risque n'est pas communiqué uniquement par une couleur.

## 6. Règles de calcul

Le calcul est déterministe. Toutes les composantes sont additionnées, puis le
résultat est plafonné à 100.

### 6.1 Volume de lignes

Le volume correspond à `ajouts + suppressions`. Les fichiers binaires ne sont
pas inclus dans ce total.

| Volume | Points |
| --- | ---: |
| 0 à 100 lignes | 0 |
| 101 à 300 lignes | 15 |
| 301 à 800 lignes | 30 |
| Plus de 800 lignes | 50 |

### 6.2 Nombre de fichiers

| Nombre de fichiers | Points |
| --- | ---: |
| 0 à 5 | 0 |
| 6 à 10 | 10 |
| 11 à 20 | 20 |
| Plus de 20 | 30 |

### 6.3 Nombre de domaines

Un domaine est le premier dossier du chemin normalisé. Un fichier à la racine
appartient au domaine `(root)`.

| Nombre de domaines | Points |
| --- | ---: |
| 0 à 2 | 0 |
| 3 à 4 | 10 |
| Au moins 5 | 20 |

### 6.4 Fichiers sensibles

Une catégorie ne contribue qu'une fois, même si plusieurs fichiers de cette
catégorie changent. Les points des catégories sont cumulés, puis ce sous-total
est plafonné à 40.

| Catégorie | Points | Motifs reconnus en v1 |
| --- | ---: | --- |
| Dépendances | 20 | `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lock`, `bun.lockb`, `Gemfile`, `Gemfile.lock` |
| CI et infrastructure | 25 | `.github/workflows/`, `.gitlab-ci.yml`, `Dockerfile`, `compose.yml`, `compose.yaml`, `docker-compose.yml`, `docker-compose.yaml`, `infra/`, `terraform/`, fichiers `.tf` |
| Authentification et sécurité | 30 | segments délimités contenant `auth`, `authentication`, `authorization`, `security`, `permission`, `permissions`, `policy` ou `policies`, ainsi que `.env` et `.env.*` |
| Schéma et migrations | 30 | dossier `migrations/`, `db/migrate/`, `schema.rb`, `schema.sql`, `prisma/schema.prisma` |

La comparaison des chemins est insensible à la casse. Les séparateurs Windows
sont normalisés en `/`. Pour les mots de sécurité, un segment doit être délimité
par le début, la fin, `.`, `_` ou `-` afin d'éviter de faire correspondre un mot
plus long sans rapport.

### 6.5 Verdict

| Score | Verdict interne | Libellé français |
| --- | --- | --- |
| 0 à 19 | `low` | Faible |
| 20 à 49 | `medium` | Moyen |
| 50 à 100 | `high` | Élevé |

Le résumé cite le verdict, les métriques principales et les signaux activés par
ordre décroissant de points. Il ne contient aucun jugement non dérivé des
données calculées.

## 7. Acquisition Git

Le backend utilise `child_process.execFile` et ne construit aucune commande via
un shell. Les appels Git doivent utiliser des sorties séparées par le caractère
NUL afin de prendre en charge les espaces dans les chemins.

Séquence prévue :

1. résoudre le chemin absolu réel du dépôt ;
2. exécuter `git rev-parse --show-toplevel` ;
3. récupérer la branche avec `git symbolic-ref --short HEAD`, ou `null` en mode
   detached HEAD ;
4. récupérer les statistiques avec `git diff --numstat -z --find-renames` ;
5. récupérer les statuts avec `git diff --name-status -z --find-renames` ;
6. ajouter `--cached` aux deux commandes lorsque le mode est `staged` ;
7. fusionner les résultats par chemin final normalisé.

Pour un renommage, le résultat conserve `previousPath` et utilise le nouveau
chemin pour le domaine, le type et les catégories sensibles. Une valeur `-`
dans `--numstat` identifie un contenu binaire : `additions` et `deletions` valent
alors `null`.

## 8. Architecture technique

### Technologies

- Node.js 20 ou version LTS plus récente.
- TypeScript pour le frontend et le backend.
- React et Vite pour l'interface.
- Express pour le serveur HTTP local.
- Vitest pour les tests unitaires et d'intégration.
- React Testing Library pour les composants.
- Supertest pour l'API.
- ESLint pour le linting.
- Aucun ORM et aucune base de données.

### Organisation implémentée

```text
diff-impact-analyzer/
├── frontend/             # React, Vite et client API
├── backend/              # acquisition Git, analyseur, CLI et serveur Express
├── shared/               # contrat TypeScript partagé
├── scripts/              # contrôle navigateur Playwright
├── docs/                 # concepts, captures et support de présentation
├── brief.md
├── brainstorming-project.md
├── journal.md
├── README.md
├── package-lock.json
└── package.json          # scripts d'orchestration npm
```

Le moteur d'analyse du backend doit être indépendant d'Express et du rendu CLI.
La CLI et l'API appellent la même fonction afin de garantir un résultat
identique. Les types de réponse publics sont partagés avec le frontend ou
reproduits dans un module de contrat unique, sans dupliquer les règles métier.

### Flux de données

```text
Dépôt Git
   |
   v
Acquisition Git par execFile
   |
   v
Normalisation des fichiers et métriques
   |
   v
Moteur de signaux et de score
   |----------------------|
   v                      v
Rendu CLI             API JSON locale
                          |
                          v
                     Interface React
```

## 9. Interfaces publiques implémentées

### 9.1 CLI

Interface disponible :

```text
diff-impact-analyzer [--repo <path>] [--staged] [--format text|markdown]
```

- `--repo` : dépôt cible, avec le dossier courant par défaut ;
- `--staged` : mode `staged`, sinon mode `working` ;
- `--format` : `text` par défaut ou `markdown` ;
- `--help` : affiche l'aide sans lancer d'analyse ;
- code de sortie `0` : analyse réussie, y compris sans changement ;
- code de sortie `1` : erreur Git, système ou dépôt invalide ;
- code de sortie `2` : argument ou valeur invalide.

### 9.2 Serveur

Le serveur reçoit le dépôt via `--repo <path>` au démarrage. Le dossier courant
est utilisé par défaut. Il refuse de démarrer si Git est absent ou si le chemin
n'appartient pas à un dépôt Git. Il écoute sur `127.0.0.1:3000`.

En développement, CORS accepte uniquement `http://localhost:5173` et
`http://127.0.0.1:5173`.

#### `GET /api/repository`

Réponse `200` :

```json
{
  "root": "/absolute/path/to/repository",
  "branch": "main"
}
```

`branch` vaut `null` en detached HEAD.

#### `POST /api/analyze`

Corps :

```json
{
  "mode": "working"
}
```

`mode` accepte uniquement `working` ou `staged`.

Réponse `200` :

```json
{
  "repository": {
    "root": "/absolute/path/to/repository",
    "branch": "main"
  },
  "mode": "working",
  "analyzedAt": "2026-07-10T10:00:00.000Z",
  "metrics": {
    "filesChanged": 2,
    "additions": 120,
    "deletions": 15,
    "linesChanged": 135,
    "domains": ["backend", "frontend"],
    "fileTypes": {
      ".ts": 1,
      ".tsx": 1
    }
  },
  "files": [
    {
      "status": "modified",
      "path": "backend/src/auth.ts",
      "previousPath": null,
      "domain": "backend",
      "fileType": ".ts",
      "additions": 80,
      "deletions": 10,
      "binary": false,
      "sensitiveCategories": ["security"]
    }
  ],
  "signals": [
    {
      "id": "sensitive-security",
      "label": "Authentification ou sécurité modifiée",
      "points": 30,
      "reason": "1 fichier correspond à la règle security.",
      "paths": ["backend/src/auth.ts"]
    }
  ],
  "risk": {
    "score": 45,
    "level": "medium",
    "label": "Moyen"
  },
  "summary": "Risque moyen : 2 fichiers et 135 lignes modifiées ; un fichier de sécurité est concerné."
}
```

Erreur HTTP :

```json
{
  "error": {
    "code": "INVALID_MODE",
    "message": "mode must be working or staged"
  }
}
```

Codes implémentés : `INVALID_MODE` avec HTTP 400, `GIT_COMMAND_FAILED` avec HTTP 500
et `INTERNAL_ERROR` avec HTTP 500. Le dépôt étant validé au démarrage, un dépôt
invalide n'est pas une erreur d'analyse HTTP.

## 10. Maquettes

### CLI texte

```text
Diff Impact Analyzer
Repository : /projects/example (main)
Mode       : staged

Metrics
- Files changed : 8
- Lines          : +200 / -50
- Domains        : backend, frontend, config
- File types     : .ts (5), .tsx (2), .json (1)

Risk score : 45/100 — MOYEN

Signals
- +15 Diff volume: 250 changed lines
- +10 File count: 8 changed files
- +20 Sensitive dependency file: package-lock.json

Summary
Medium risk: the diff is moderately large and changes a dependency lockfile.
Review the diff and run the relevant checks before committing.
```

### Interface web

```text
+--------------------------------------------------------------------+
| Diff Impact Analyzer                                               |
| Repository: /projects/example                    Branch: main       |
+--------------------------------------------------------------------+
| Changes: (o) Non indexé  ( ) Indexé          [Analyser]             |
+--------------------------------------------------------------------+
| 8 fichiers | +200 | -50 | 3 domaines | RISQUE MOYEN — 45/100       |
+--------------------------------------------------------------------+
| Fichiers                                                           |
| M  backend/src/auth.ts      .ts     backend    +80  -10  sensible  |
| M  frontend/src/App.tsx     .tsx    frontend   +42   -8            |
+--------------------------------------------------------------------+
| Signaux                                                            |
| +20  Dépendance sensible modifiée                                  |
| +15  Volume de 250 lignes                                          |
| +10  Huit fichiers modifiés                                        |
+--------------------------------------------------------------------+
| Résumé                                                             |
| Risque moyen : changement modérément volumineux et lockfile touché. |
| Ce score mesure la portée, pas la qualité ni l'absence de régression.|
+--------------------------------------------------------------------+
```

États supplémentaires :

- initial : aucune analyse lancée ;
- chargement : bouton désactivé et statut annoncé ;
- aucun changement : métriques à zéro, score 0 et verdict Faible ;
- erreur : message explicite et possibilité de relancer l'analyse.

## 11. Contraintes

### Techniques

- L'application s'exécute localement et nécessite Node.js et Git.
- L'installation initiale des dépendances nécessite un accès au registre npm.
- L'analyse elle-même ne nécessite aucun accès internet.
- Le serveur ne doit pas écouter sur une interface réseau publique.
- Aucune chaîne issue de l'utilisateur ne doit être évaluée par un shell.
- Le frontend et la CLI doivent afficher le même score pour le même rapport.
- La première version cible un dépôt Git standard sur Linux, macOS et Windows ;
  les chemins doivent être normalisés avant analyse.

### Fonctionnelles

- Le score doit rester explicable et déterministe.
- Le rapport doit distinguer une valeur nulle d'une mesure indisponible.
- L'absence de signal ne doit pas être présentée comme une garantie.
- La CLI doit rester utilisable sans lancer le frontend.

### Accessibilité

- Navigation au clavier complète.
- Labels associés aux contrôles.
- Focus visible.
- Messages de statut annoncés aux technologies d'assistance.
- Verdict représenté par du texte et non uniquement par une couleur.
- Contraste conforme au minimum WCAG AA.

## 12. Stratégie de tests

### Moteur et score

- bornes 100/101, 300/301 et 800/801 lignes ;
- bornes 5/6, 10/11 et 20/21 fichiers ;
- bornes 2/3 et 4/5 domaines ;
- chaque catégorie sensible, déduplication et plafond de 40 ;
- score global plafonné à 100 ;
- verdicts aux scores 19/20 et 49/50 ;
- ordre stable des signaux et résumé déterministe.

### Git

- working tree et index contenant des changements différents ;
- diff vide ;
- ajout, modification, suppression et renommage ;
- plusieurs domaines et extensions ;
- chemin contenant des espaces ;
- fichier sans extension ;
- fichier binaire ;
- detached HEAD ;
- chemin hors dépôt et Git indisponible.

Les tests d'intégration créent des dépôts temporaires isolés et ne modifient pas
le dépôt du projet.

### CLI et API

- valeurs par défaut et toutes les options ;
- formats texte et Markdown ;
- stdout, stderr et codes de sortie ;
- contrats des deux endpoints ;
- validation d'un mode invalide ;
- propagation contrôlée d'une erreur Git ;
- CORS limité aux origines prévues.

### Frontend

- affichage du dépôt et de la branche ;
- changement de mode ;
- états initial, chargement, succès, vide et erreur ;
- rendu des métriques, fichiers, signaux et verdict ;
- navigation clavier et libellé textuel du risque.

### Vérifications finales

- lint ;
- vérification TypeScript ;
- tests unitaires et d'intégration ;
- build de production ;
- lancement local du build ;
- comparaison manuelle des compteurs avec un diff simple ;
- répétition du scénario de présentation.

## 13. Plan de réalisation

1. **Spécification** — faire relire ce cahier des charges et verrouiller le
   périmètre.
2. **Initialisation** — créer les espaces frontend et backend, les scripts, le
   linter, Vitest et la vérification TypeScript.
3. **Acquisition Git** — valider le dépôt, exécuter Git et normaliser les
   statuts et statistiques avec des tests d'intégration.
4. **Métriques et score** — implémenter les domaines, types, catégories
   sensibles, signaux, plafonds et verdicts avec tests unitaires.
5. **CLI** — ajouter les arguments, les formats texte et Markdown, les sorties
   et codes d'erreur.
6. **API** — ajouter Express, les deux endpoints, la validation et CORS.
7. **Frontend** — construire la maquette React et tous les états d'interface.
8. **Débogage et refactoring** — analyser les erreurs, supprimer les
   duplications, améliorer les noms et faire passer lint, types et tests.
9. **Documentation et présentation** — mettre à jour le README avec les vraies
   commandes, compléter le journal, ajouter les captures et préparer le pitch.

Chaque étape doit donner lieu à un commit cohérent. Exemples :

- `docs: define diff analyzer requirements`
- `feat: collect working and staged git metrics`
- `feat: calculate deterministic risk score`
- `feat: add text and markdown CLI reports`
- `feat: expose local analysis API`
- `feat: display analysis dashboard`
- `test: cover git and scoring edge cases`
- `docs: add verified setup and usage guide`

## 14. Définition de fini du MVP

Le MVP est terminé lorsque :

- la CLI et l'interface analysent les modes working et staged ;
- les métriques correspondent aux fixtures et aux vérifications manuelles ;
- toutes les composantes du score sont visibles et conformes aux seuils ;
- CLI et frontend donnent le même score pour la même analyse ;
- les erreurs prévues sont gérées sans trace non contrôlée ni blocage de l'UI ;
- lint, vérification TypeScript, tests et build réussissent ;
- le README documente uniquement des commandes réellement vérifiées ;
- le journal relate les contributions de l'IA et leur validation ;
- les captures et le pitch de deux à trois minutes sont prêts.

## 15. Évolutions possibles

Après validation du MVP :

- export explicite du rapport vers un fichier Markdown ou HTML ;
- fichier de configuration des règles ;
- GitHub Action pour les pull requests ;
- hook `pre-commit` ou `pre-push` ;
- intégration à un assistant IA ;
- comparaison avec une branche de référence.

## 16. État de validation au 11 juillet 2026

- 39 tests backend couvrent le parsing Git, l'intégration avec des dépôts
  temporaires, les seuils du score, l'API et les sorties CLI.
- 9 tests frontend couvrent les modes, les erreurs, les contrats JSON, les états
  vide et succès, ainsi que l'affichage des fichiers binaires ou renommés.
- ESLint, la vérification TypeScript et les builds `tsup`/Vite réussissent.
- Le contrôle navigateur existant vérifie la console, les réponses HTTP et le
  débordement mobile ; ses assertions métier restent une amélioration future.
