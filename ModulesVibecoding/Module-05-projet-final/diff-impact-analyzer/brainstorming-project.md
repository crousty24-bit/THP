# Brainstorming — Diff Impact Analyzer

## Statut du document

Ce document rassemble les hypothèses examinées avant la rédaction du cahier des
charges. Les décisions validées sont formalisées dans `brief.md`.

Le projet est actuellement en phase de planification. Aucun code, aucune
dépendance et aucune capture d'écran n'ont encore été produits.

## Idée retenue

Diff Impact Analyzer est un outil de développement local qui analyse les
changements Git non indexés (`git diff`) ou indexés (`git diff --cached`). Il
mesure la portée du changement, détecte des signaux de vigilance et restitue un
score de risque explicable avant la validation du travail.

Le problème ciblé est concret : un développeur ou un agent IA peut produire une
modification plus large, plus dispersée ou plus sensible que prévu. Lire le diff
reste indispensable, mais une synthèse déterministe peut orienter la revue.

## Proposition de valeur

> Donner, en quelques secondes, une mesure reproductible de la portée d'un
> changement Git et expliquer les facteurs qui demandent le plus d'attention.

L'outil ne juge pas la qualité du code et ne prédit pas une régression. Il
complète Code Quality Guardian : ce dernier examine des règles de qualité,
tandis que Diff Impact Analyzer mesure la taille, la dispersion et la
sensibilité d'un changement.

## Utilisateurs visés

### Développeur junior

Il veut vérifier que sa modification reste maîtrisée avant de la committer. Il
a besoin d'indicateurs lisibles et d'explications, pas d'un score opaque.

### Reviewer ou développeur confirmé

Il veut obtenir une vue d'ensemble avant la lecture détaillée d'un diff et
identifier rapidement les domaines ou fichiers à examiner en priorité.

### Utilisateur d'un assistant IA

Il veut contrôler que les fichiers modifiés par l'agent correspondent au
périmètre demandé et repérer une expansion involontaire du changement.

## Hypothèses étudiées

### Application uniquement dans le navigateur

Cette option aurait permis une architecture React simple, mais un navigateur ne
peut pas exécuter directement `git diff` dans un dépôt arbitraire. Coller un
diff aurait déplacé l'effort vers l'utilisateur et répondu imparfaitement à
l'objectif d'analyse automatique d'un dépôt local.

### CLI uniquement

Une CLI Node aurait été suffisante pour le besoin central et facile à
automatiser. Elle n'aurait toutefois pas exploité la contrainte pédagogique
React, Vite et TypeScript, ni fourni la maquette visuelle attendue.

### CLI et interface locale partageant le même moteur

Cette solution est retenue. La CLI répond directement au besoin Git. Un serveur
Node local réutilise le même moteur et expose le résultat à une interface React.
Le dépôt est fixé au démarrage du serveur et affiché en lecture seule dans
l'interface.

## Décisions validées

- `diff-impact-analyzer/` est la racine du projet ; aucun sous-dossier
  `final_project/` ne sera ajouté.
- Le frontend prévu utilise React, Vite et TypeScript.
- Le backend prévu utilise Node.js, Express et TypeScript.
- Node est préféré à Rails pour partager les types, les règles et l'écosystème
  de test avec la CLI et le frontend.
- La CLI reste l'interface principale pour l'analyse directe d'un dépôt.
- Le serveur est local, lié à `127.0.0.1`, et reçoit le dépôt au démarrage.
- La v1 ne possède ni compte, ni historique, ni base de données.
- Le score repose sur des règles fixes, documentées et testables, plafonnées à
  100.
- L'analyse ne nécessite aucune API d'IA à l'exécution.
- L'IA sert à accélérer la conception et l'implémentation ; ses contributions
  et leur vérification seront consignées dans `journal.md`.

## MVP retenu

### Acquisition du changement

- analyser le working tree avec l'équivalent de `git diff` ;
- analyser l'index avec l'équivalent de `git diff --cached` ;
- choisir un dépôt avec `--repo` dans la CLI ;
- fixer le dépôt lors du démarrage du serveur local ;
- exclure les fichiers non suivis, conformément au comportement de ces
  commandes Git.

### Métriques

- nombre et statut des fichiers modifiés ;
- lignes ajoutées et supprimées ;
- domaines de premier niveau impactés ;
- répartition par extension ou type de fichier ;
- identification des changements binaires non mesurables en lignes.

### Signaux de vigilance

- diff volumineux ;
- grand nombre de fichiers ;
- changement réparti dans plusieurs domaines ;
- présence de fichiers sensibles : dépendances, infrastructure, sécurité ou
  schéma de données.

### Restitution

- score de 0 à 100 ;
- verdict Faible, Moyen ou Élevé ;
- explication de chaque signal et des points associés ;
- résumé déterministe ;
- rendu CLI texte ou Markdown ;
- tableau de bord React pour le même résultat.

## Limites assumées

- Un diff ne contient pas tout le contexte fonctionnel du dépôt.
- Une modification courte peut être dangereuse et une modification longue peut
  être mécanique.
- Les chemins sensibles reposent sur des conventions de nommage et peuvent
  produire des faux positifs ou des faux négatifs.
- Les fichiers non suivis ne sont pas analysés en v1.
- Les fichiers binaires sont comptés, mais leurs lignes ne sont pas mesurées.
- L'outil ne lit pas la sémantique du code, n'exécute pas les tests et ne
  remplace pas une revue humaine.

## Évolutions écartées du MVP

- GitHub Action pour les pull requests ;
- hook `pre-commit` ou `pre-push` ;
- export vers un fichier HTML ou Markdown ;
- règles configurables par dépôt ;
- historique persistant des analyses ;
- intégration à Codex, Claude Code ou un autre assistant ;
- analyse sémantique par un modèle d'IA.

## Critère principal de réussite

Sur un dépôt Git de démonstration, l'utilisateur doit pouvoir analyser les
changements non indexés ou indexés, retrouver des métriques vérifiables à la
main, comprendre chaque point du score et obtenir le même verdict depuis la CLI
et l'interface web locale.

## Prochaine étape

Faire valider `brief.md`, puis initialiser les espaces TypeScript. La première
implémentation devra porter sur l'acquisition Git et le moteur de métriques,
avant toute construction de l'interface.
