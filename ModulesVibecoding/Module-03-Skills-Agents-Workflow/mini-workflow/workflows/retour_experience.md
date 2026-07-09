# Retour d'experience : workflow `sortNumbers`

## Objectif du workflow

Creer une fonction JavaScript `sortNumbers` avec specification, tests unitaires, implementation et README, en suivant un processus decoupe en prompts successifs.

## Etapes qui se sont bien passees

- La specification etait simple a formaliser parce que le perimetre de la fonction etait limite.
- Les tests unitaires ont pu etre ecrits sans dependance externe avec `node:assert/strict`.
- L'implementation est restee courte et directement verifiable.

## Etapes qui ont necessite plusieurs iterations

- A completer apres execution personnelle du workflow.
- Point a surveiller : certains prompts peuvent produire un tri lexicographique si le tri numerique n'est pas explicitement demande.
- Point a surveiller : l'IA peut oublier de verifier que chaque element du tableau est un nombre.

## Interventions humaines

- Verification du perimetre de la specification.
- Verification que le README ne documente pas de fonctionnalite non implementee.
- Execution des tests avec `node sortNumbers.test.js`.
- A completer si des corrections manuelles sont realisees pendant le test du workflow.

## Limites observees de l'IA

- L'IA peut proposer une solution correcte mais incomplete si les contraintes ne sont pas detaillees.
- L'IA peut generer des tests qui valident le cas nominal sans couvrir les erreurs.
- L'IA ne remplace pas la verification par execution des tests.

## Ameliorations possibles

- Ajouter un prompt de revue apres l'implementation pour comparer le code a la specification.
- Ajouter une etape de correction ciblee en cas d'echec de test.
- Demander a l'IA de produire une courte checklist de validation avant le commit.

## Resultat de verification

Commande a executer :

```bash
node sortNumbers.test.js
```

Resultat observe :

```text
All sortNumbers tests passed.
```
