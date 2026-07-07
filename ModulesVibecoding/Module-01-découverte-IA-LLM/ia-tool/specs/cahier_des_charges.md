# Cahier des charges - Vibecoding IA Tool

## 1. Contexte et objectif

Vibecoding IA Tool est un outil d'aide à la génération de tests unitaires pour
les développeurs. Le problème ciblé est simple : écrire les premiers tests utiles
peut être lent, surtout quand le code est peu connu, ancien ou mal couvert.

L'objectif de la première version est de permettre à un développeur de coller un
extrait de code, de choisir un framework de test, puis d'obtenir une proposition
de tests unitaires lisibles. L'outil doit aussi expliquer pourquoi chaque test
est proposé et signaler les hypothèses que le développeur doit vérifier.

Le projet est intéressant car il combine productivité et apprentissage. L'IA ne
remplace pas le jugement du développeur : elle fournit un brouillon structuré que
l'utilisateur doit relire, corriger et valider.

## 2. Périmètre

### Inclus dans la première version

- Saisie ou collage d'un extrait de code dans une interface simple.
- Choix d'un framework de test cible : Jest, Vitest ou RSpec.
- Génération d'une liste de cas de test prioritaires.
- Génération d'un brouillon de tests unitaires.
- Explication courte pour chaque test proposé.
- Affichage des hypothèses faites par l'IA.
- Possibilité de copier le résultat généré.

### Exclu de la première version

- Connexion directe à un dépôt GitHub, GitLab ou autre forge.
- Analyse automatique d'un projet complet.
- Exécution réelle des tests générés.
- Modification automatique des fichiers du projet de l'utilisateur.
- Gestion d'un compte utilisateur ou d'un historique sauvegardé.
- Support de tous les langages et frameworks de test.
- Garantie que les tests générés sont corrects sans relecture humaine.

## 3. Personas

### Lina, développeuse web junior

Lina connaît les bases des tests unitaires, mais elle a du mal à identifier les
cas importants à couvrir en premier. Elle a besoin d'un outil qui l'aide à
structurer ses tests, à comprendre les cas limites et à apprendre sans copier
aveuglément une réponse générée.

### Marc, développeur full-stack sur projet legacy

Marc travaille sur une base de code peu testée. Avant de modifier un module
ancien, il veut générer quelques tests de régression pour protéger le comportement
existant. Il a besoin de repérer rapidement les cas normaux, les limites et les
hypothèses incertaines.

## 4. User stories

Les user stories sont triées par importance pour la première version.

1. En tant que développeur junior, je veux obtenir une liste de cas de test à
   partir d'une fonction afin de comprendre les comportements à vérifier.

2. En tant que développeur travaillant sur du code existant, je veux générer des
   tests de régression avant une modification afin de réduire le risque de casser
   un comportement existant.

3. En tant que membre d'une petite équipe, je veux choisir le framework de test
   cible afin d'obtenir un brouillon compatible avec les conventions du projet.

4. En tant que développeur, je veux lire une explication pour chaque test proposé
   afin de vérifier si la suggestion correspond au comportement attendu.

5. En tant que reviewer, je veux voir les hypothèses faites par l'IA afin
   d'identifier rapidement ce qui doit être confirmé ou corrigé.

## 5. Contraintes

### Contraintes techniques

- Première version orientée application web simple.
- Interface prévue en HTML, CSS et JavaScript pour rester cohérente avec un
  prototype front-end léger.
- Aucun secret ou clé API ne doit être codé en dur dans le JavaScript suivi par
  Git.
- Si une API IA est utilisée plus tard, la configuration devra passer par un
  fichier local ignoré ou par des variables d'environnement selon le mode de
  déploiement choisi.
- Le résultat généré doit rester éditable ou copiable par l'utilisateur.

### Contraintes fonctionnelles

- Les réponses générées doivent clairement séparer les tests proposés, les
  explications et les hypothèses.
- L'outil doit rappeler que les tests générés sont un brouillon à valider.
- L'interface doit rester utilisable sans connaissance avancée en testing.

### Contraintes légales et qualité

- L'utilisateur reste responsable du code transmis à l'outil.
- L'application ne doit pas encourager l'envoi de secrets, de clés API ou de code
  confidentiel dans un service tiers.
- Le contenu généré doit être présenté comme une aide, pas comme une vérité
  garantie.

### Contraintes de performance

- L'interface doit rester réactive lors de la saisie et de l'affichage du
  résultat.
- Les extraits de code très longs ne sont pas prioritaires dans la première
  version.

## 6. Maquette

Maquette ASCII de la première interface :

```text
+------------------------------------------------------------------+
| Vibecoding IA Tool                                                |
| Generate a useful unit test draft from your code                  |
+------------------------------------------------------------------+
| Framework                                                        |
| [ Jest v ] [ Vitest ] [ RSpec ]                                  |
+------------------------------------------------------------------+
| Source code                                                       |
| +--------------------------------------------------------------+ |
| | function priceWithTax(price, taxRate) {                      | |
| |   return price + price * taxRate;                            | |
| | }                                                            | |
| +--------------------------------------------------------------+ |
| [ Generate tests ]                                                |
+------------------------------------------------------------------+
| Proposed tests                                                    |
| 1. returns price including tax for a normal value                 |
| 2. handles zero tax rate                                          |
| 3. handles decimal prices                                         |
+------------------------------------------------------------------+
| Draft test code                                                   |
| +--------------------------------------------------------------+ |
| | describe("priceWithTax", () => { ... })                      | |
| +--------------------------------------------------------------+ |
| [ Copy result ]                                                   |
+------------------------------------------------------------------+
| Explanations and assumptions                                      |
| - Normal case checks the expected business behavior.              |
| - Assumption: taxRate is provided as 0.2 for 20%.                 |
+------------------------------------------------------------------+
```

## 7. Suggestions de l'IA

### Suggestion 1

Ajouter une limite claire sur la taille des extraits de code acceptés dans la
première version.

Commentaire : acceptée. Cette limite évite de promettre une analyse complète de
projet alors que le périmètre retenu concerne uniquement une fonction, une classe
ou un petit module.

### Suggestion 2

Prévoir un indicateur de confiance pour chaque test généré.

Commentaire : refusée pour la première version. L'idée est utile, mais elle
risque de donner une fausse impression de fiabilité. Les hypothèses explicites
sont plus adaptées au niveau actuel du projet.

### Suggestion 3

Ajouter une zone permettant à l'utilisateur de préciser le comportement attendu
avant la génération.

Commentaire : acceptée comme amélioration possible. Cette option aiderait l'IA à
éviter certaines suppositions, mais elle n'est pas indispensable au prototype
minimal. Elle pourra être ajoutée après la première interface de base.

### Suggestion 4

Permettre l'export du brouillon dans un fichier de test prêt à intégrer.

Commentaire : refusée pour la première version. La copie manuelle du résultat est
suffisante pour un premier prototype et limite le risque d'intégrer un fichier
non relu dans un projet réel.
