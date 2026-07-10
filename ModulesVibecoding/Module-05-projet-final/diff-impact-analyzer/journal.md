# Journal de développement — Diff Impact Analyzer

## Règles du journal

Ce journal doit distinguer les faits vérifiés, les propositions de l'IA et les
décisions humaines. Une fonctionnalité ne sera jamais présentée comme terminée
avant d'avoir été exécutée et testée.

Pour chaque étape, noter :

- l'objectif ;
- le prompt ou son résumé fidèle ;
- la proposition reçue ;
- ce qui a été accepté, modifié ou refusé ;
- les erreurs et difficultés rencontrées ;
- les commandes de vérification et leurs résultats réels ;
- les incertitudes restantes.

## 10 juillet 2026 — Analyse initiale de la consigne

### Objectif

Analyser la consigne du projet final sans écrire de code et vérifier si l'idée
Diff Impact Analyzer pouvait former un MVP réaliste.

### Usage de l'IA

L'IA a reçu la consigne générale du projet final et le chemin du dossier cible.
Elle a inspecté le dossier, constaté qu'il était vide et consulté les exemples
de cahier des charges présents dans les modules précédents.

Elle a proposé un premier cadrage centré sur un outil local, déterministe et
explicable. La première hypothèse était une application React traitant un diff
collé dans le navigateur, sans backend.

### Décisions et regard critique

- Accepté : limiter le MVP à des métriques et des heuristiques explicables.
- Accepté : ne jamais présenter le score comme une probabilité de régression.
- Accepté : exclure l'IA à l'exécution du MVP ; son usage porte sur le processus
  de développement.
- Accepté : éviter une base de données et un CRUD artificiel.
- À corriger lors du cadrage suivant : l'analyse par diff collé ne satisfait pas
  complètement l'objectif d'exécuter `git diff` ou `git diff --cached` sur un
  dépôt local.

### Vérification

- Le dossier cible ne contenait aucun code ni configuration.
- Un document de brainstorming initial a été créé.
- Aucun comportement applicatif ne pouvait être testé.

## 10 juillet 2026 — Cadrage technique et plan du MVP

### Objectif

Réconcilier les exigences suivantes : analyse directe d'un dépôt Git, sortie
CLI, frontend React/Vite/TypeScript et choix d'un backend simple.

### Usage de l'IA

L'IA a exploré les outils locaux et les conventions du dépôt, puis a proposé
plusieurs architectures et demandé de verrouiller les choix qui modifiaient
fortement le périmètre.

Les décisions confirmées sont :

- MVP composé d'une CLI et d'une interface locale ;
- `diff-impact-analyzer/` utilisé comme racine du livrable ;
- noms standards `brainstorming-project.md` et `README.md` ;
- dépôt fixé au démarrage du serveur ;
- score fixe de 0 à 100 ;
- livraison documentaire avant toute génération de code.

### Propositions acceptées

- Node.js, Express et TypeScript pour le backend et la CLI.
- React, Vite et TypeScript pour le frontend.
- Un moteur partagé entre la CLI et l'API.
- Exécution de Git via `execFile`, sans shell.
- Serveur limité à `127.0.0.1` et CORS restreint en développement.
- Score basé sur le volume, le nombre de fichiers, les domaines et des chemins
  sensibles.
- Absence de base de données et d'historique dans le MVP.

### Alternatives non retenues

- CLI uniquement : plus simple, mais ne répond pas au volet React demandé.
- Interface uniquement : ne fournit pas la sortie CLI attendue.
- Dépôt saisi dans l'interface : plus flexible, mais élargit la surface de
  validation et d'accès au système de fichiers.
- Rails : aucun avantage identifié pour un outil TypeScript sans persistance.
- Règles configurables : utiles plus tard, mais trop larges pour la v1.
- Analyse par IA à l'exécution : non déterministe et inutile pour les métriques
  du MVP.

### État vérifié après cette étape

- Le cahier des charges, le brainstorming, le présent journal et un README de
  planification sont les seuls livrables prévus.
- Aucun frontend, backend, package npm, test ou capture n'est encore créé.
- Les commandes décrites dans le cahier des charges sont des interfaces cibles,
  pas des commandes actuellement disponibles.

## Modèle pour les prochaines entrées

Copier cette section pour chaque étape significative.

```text
## AAAA-MM-JJ — Titre de l'étape

### Objectif

### Prompt ou demande adressée à l'IA

### Proposition reçue

### Décisions humaines
- Accepté :
- Modifié :
- Refusé :

### Difficultés et erreurs observées

### Correction ou refactoring

### Vérification réelle
- Commande :
- Résultat :

### Incertitudes restantes
```

## Étapes futures prévues

Ces éléments ne sont pas encore réalisés :

1. initialisation TypeScript et outillage de qualité ;
2. acquisition des données Git ;
3. métriques et moteur de score ;
4. CLI texte et Markdown ;
5. API Express et CORS ;
6. interface React ;
7. tests, débogage et refactoring ;
8. captures, README final et pitch.
