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

## Plan initial de première passe

- [x] initialisation TypeScript et outillage de qualité ;
- [x] acquisition des données Git ;
- [x] métriques et moteur de score ;
- [x] CLI texte et Markdown ;
- [x] API Express et CORS ;
- [x] interface React ;
- [x] tests, débogage et premier refactoring ;
- [x] captures et README vérifié ;
- [ ] pitch final de deux à trois minutes.

## 10 juillet 2026 — Première passe fonctionnelle du MVP

### Objectif

Générer un squelette front et back réellement exécutable à partir du cahier des
charges : moteur Git, score, CLI, API Express et tableau de bord React.

### Aide de l'IA

L'IA a servi à :

- transformer le contrat du brief en types TypeScript partagés ;
- proposer le découpage du moteur, de la CLI, de l'API et des composants React ;
- générer deux concepts visuels desktop et mobile avant l'implémentation ;
- produire les premiers tests de parsing, de score, d'API et de composants ;
- analyser les erreurs observées lors des tests et du lancement réel ;
- comparer les captures du navigateur avec les concepts visuels.

Les concepts sont conservés dans `docs/design/`. Les captures de l'application
réelle sont conservées dans `docs/screenshots/`.

### Décisions humaines

- Accepté : moteur unique réutilisé par la CLI et l'API.
- Accepté : `execFile` avec sorties Git séparées par NUL, sans shell.
- Accepté : validation des réponses JSON à la frontière du frontend.
- Accepté : interface sombre, dense et structurée autour d'un tableau.
- Accepté : limiter initialement la liste à douze fichiers sur desktop et six
  sur mobile, avec une action d'affichage complet.
- Modifié : le concept mobile proposait une comparaison de branches et une
  jauge circulaire. Ces éléments ont été écartés car ils dépassent le périmètre
  `working` / `staged` et n'apportent pas de donnée supplémentaire.
- Refusé : persistance, configuration des règles et analyse par IA dans cette
  première passe.

### Erreurs observées et corrections

#### Valeurs binaires transformées en zéro

Le premier test d'intégration Git a montré que `null`, utilisé pour les lignes
non mesurables d'un binaire, était remplacé par `0` lors de la fusion des
statistiques. La fusion vérifie maintenant la présence de l'enregistrement au
lieu d'utiliser une valeur de repli fondée sur `null`.

#### Tests React non isolés

Les premiers tests frontend conservaient le DOM du cas précédent et une
assertion cherchait une chaîne répartie sur plusieurs nœuds. Le nettoyage du DOM
a été rendu explicite et l'assertion porte maintenant sur la région accessible
du risque.

#### Exécution directe avec `tsx` sous WSL

`tsx` tentait de créer un socket IPC dans un chemin temporaire Windows monté
sous WSL et échouait avec `ENOTSUP`. Les commandes de développement et de CLI
construisent désormais les entrées avec `tsup`, puis les exécutent avec Node.

#### Erreur console pour le favicon

Le premier passage Playwright a observé une ressource favicon en 404. Un favicon
SVG embarqué dans `index.html` supprime cette requête et permet de conserver une
console propre.

#### Capture prise pendant l'animation

La première capture rendait le rapport artificiellement sombre, car elle était
prise dès l'apparition du composant. Le contrôle navigateur attend maintenant la
fin de l'animation avant la capture.

### Vérifications réelles

- ESLint : succès.
- Vérification TypeScript backend et frontend : succès.
- Vitest backend : 22 tests réussis.
- Vitest frontend : 2 tests réussis.
- Build `tsup` et Vite : succès.
- Audit npm de production et audit complet après mise à jour d'`esbuild` :
  aucune vulnérabilité signalée.
- CLI compilée exécutée sur le dépôt local : rapport texte produit.
- Playwright avec le Chrome système : chargement de l'API, sélection du mode
  indexé et analyse réussis.
- Console navigateur : aucune erreur ou alerte.
- Réponses HTTP en échec pendant le scénario : aucune.
- Débordement horizontal à 390 pixels : absent.

### État atteint

La première passe produit un outil fonctionnel localement. Le cœur du MVP est
présent, mais le packaging, les tests CLI de bout en bout, l'export vers un
fichier et les intégrations Git automatiques restent à développer.

## Prochaine passe proposée

1. Ajouter des tests de bout en bout de la CLI, notamment stdout, stderr, codes
   de sortie et snapshots Markdown.
2. Centraliser le middleware d'erreur Express et tester les corps JSON invalides
   ou trop volumineux.
3. Ajouter un filtrage de la table par domaine et type de fichier.
4. Ajouter un export explicite du rapport texte ou Markdown.
5. Préparer un package exécutable depuis n'importe quel dépôt.
6. Évaluer ensuite un hook Git et une GitHub Action, sans modifier le contrat du
   moteur tant qu'il n'est pas stabilisé.

## 11 juillet 2026 — Audit qualité et renforcement des tests

### Objectif

Vérifier la cohérence du code et des documents, puis renforcer les tests les
plus directement liés aux contrats publics sans ajouter de fonctionnalité.

### Observations

- Le README et l'entrée précédente du journal décrivaient correctement le MVP.
- Le brainstorming indiquait encore que le projet n'était pas implémenté.
- Le brief décrivait la CLI comme future et son arborescence omettait le contrat
  partagé et le script de contrôle navigateur.
- La CLI, les rendus et plusieurs erreurs API ne possédaient pas de test direct.
- Le frontend ne validait que superficiellement les objets imbriqués d'un
  rapport JSON.

### Changements réalisés

- Mise à jour du statut, de l'arborescence et des interfaces dans les documents.
- Tests backend ajoutés pour la CLI, les erreurs API, les suppressions Git, les
  seuils fichiers/domaines, le plafond global et l'ordre des signaux.
- Tests frontend ajoutés pour le mode indexé, les erreurs d'analyse, le rapport
  vide, les réponses JSON invalides et l'expansion de la liste des fichiers.
- Validation runtime détaillée des métriques, fichiers, signaux et du risque à
  la frontière API du frontend.

### Difficultés observées

Dans cet environnement WSL, Vitest utilisait initialement le répertoire
temporaire Windows et échouait avant le chargement des tests. `TMPDIR=/tmp`
permet d'utiliser un chemin natif. Dans une sandbox réseau restrictive,
Supertest doit également être autorisé à ouvrir son socket local temporaire.

### Vérification réelle

- Tests backend ciblés : 39 tests réussis sur 6 fichiers.
- Tests frontend ciblés : 9 tests réussis sur 3 fichiers.
- ESLint, la vérification TypeScript, les 48 tests cumulés et les builds
  `tsup`/Vite réussissent après la mise à jour documentaire.

### Limites maintenues

Aucun filtre, export, middleware supplémentaire, hook Git ou GitHub Action n'a
été ajouté. Cette passe protège le comportement existant au lieu d'élargir le
MVP.
