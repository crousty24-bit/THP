# Workflow: creer et tester `sortNumbers`

## Objectif

Creer une fonction JavaScript `sortNumbers` qui trie une liste de nombres, avec une specification, des tests unitaires, une implementation et une documentation.

## Resultat attendu

A la fin du workflow, le projet doit contenir :

- `spec.md` : specification de la fonction ;
- `sortNumbers.test.js` : tests unitaires ;
- `sortNumbers.js` : implementation ;
- `README.md` : documentation d'utilisation ;
- `workflows/retour_experience.md` : analyse du workflow et des interventions humaines.

## Etape 1 : demander la specification

### Prompt

```text
Tu es un assistant de developpement. Redige une specification claire pour une fonction JavaScript nommee sortNumbers.

Contraintes :
- la fonction accepte uniquement un tableau de nombres ;
- elle retourne un nouveau tableau trie par ordre croissant numerique ;
- elle ne modifie pas le tableau d'origine ;
- elle gere les tableaux vides, les nombres negatifs, les decimaux et les doublons ;
- elle lance une TypeError si l'entree n'est pas un tableau ou contient une valeur non numerique.

Produit uniquement le contenu Markdown du fichier spec.md.
```

### Fichier attendu

Sauvegarder la reponse dans `spec.md`.

### Validation humaine

Verifier que la specification est precise, testable et limitee a la fonction demandee.

## Etape 2 : demander les tests unitaires

### Prompt

```text
En te basant sur la specification de sortNumbers, ecris des tests unitaires JavaScript executables avec Node.js sans dependance externe.

Contraintes :
- utiliser node:assert/strict ;
- importer la fonction depuis ./sortNumbers ;
- tester le tri numerique croissant ;
- tester les nombres negatifs, decimaux et doublons ;
- tester un tableau vide ;
- tester que le tableau d'origine n'est pas modifie ;
- tester les TypeError sur entrees invalides.

Produit uniquement le contenu du fichier sortNumbers.test.js.
```

### Fichier attendu

Sauvegarder la reponse dans `sortNumbers.test.js`.

### Validation humaine

Verifier que les tests couvrent les exigences principales et qu'ils peuvent etre lances avec :

```bash
node sortNumbers.test.js
```

## Etape 3 : demander l'implementation

### Prompt

```text
Ecris l'implementation CommonJS de la fonction sortNumbers pour satisfaire cette specification et ces tests.

Contraintes :
- exporter la fonction avec module.exports ;
- ne pas modifier le tableau d'origine ;
- effectuer un tri numerique croissant ;
- lancer une TypeError si l'entree n'est pas un tableau ;
- lancer une TypeError si un element du tableau n'est pas un nombre ;
- ne pas ajouter de dependance externe.

Produit uniquement le contenu du fichier sortNumbers.js.
```

### Fichier attendu

Sauvegarder la reponse dans `sortNumbers.js`.

### Validation humaine

Executer les tests. Si un test echoue, identifier si le probleme vient du prompt, du test ou du code, puis demander une correction ciblee a l'IA.

## Etape 4 : demander le README

### Prompt

```text
Redige un README en anglais pour un mini-projet JavaScript contenant une fonction sortNumbers.

Inclure :
- le but du projet ;
- le comportement de la fonction ;
- la commande pour lancer les tests avec Node.js ;
- la structure des fichiers ;
- une mention du dossier workflows qui documente le processus IA.

Ne documente pas de fonctionnalite non implementee.
Produit uniquement le contenu Markdown du fichier README.md.
```

### Fichier attendu

Sauvegarder la reponse dans `README.md`.

### Validation humaine

Verifier que le README est en anglais et qu'il ne promet rien qui ne soit pas implemente.

## Etape 5 : tester et noter les corrections

### Commande

```bash
node sortNumbers.test.js
```

### Critere de reussite

Les tests doivent afficher :

```text
All sortNumbers tests passed.
```

Si des corrections manuelles sont necessaires, les noter dans `workflows/retour_experience.md`.

## Etape 6 : analyser le workflow

Completer `workflows/retour_experience.md` avec :

- les etapes qui se sont bien passees ;
- les etapes qui ont necessite plusieurs iterations ;
- les interventions humaines ;
- les limites observees de l'IA ;
- les ameliorations possibles du workflow.

