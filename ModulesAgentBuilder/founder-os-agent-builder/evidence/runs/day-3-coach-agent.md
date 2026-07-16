# Run — Day 3 Coach Agent

## Input

> Que dois-je apprendre pour mieux qualifier et vendre un mini-site ?

## Skill utilisé

- Agent : `$founder-os-coach`
- Workflow : `docs/skills/learning-coach.md`
- Moteur réellement exécuté : `lexical-bm25`, limite 4, vault local

## Sortie

# Plan d'apprentissage de la semaine

## Objectif

Savoir qualifier un besoin de mini-site, expliquer ses frontières et préparer
un argumentaire sans promettre de résultat, prix final ou délai non validé.

## Trace de récupération

- **Moteur :** lexical-bm25
- **Documents analysés :** 10
- **Résultats classés :**
  1. score 4.2137, `proposed`, `vault/40-seo-market/seo-ideas.md` ;
  2. score 4.0995, `validated`, `vault/20-clients/target-clients.md` ;
  3. score 2.8823, `validated`, `vault/30-offers/offer.md` ;
  4. score 1.9683, `proposed`, `vault/70-learning/learning-plan.md`.

## Bases tirées des notes

- La qualification doit couvrir objectif, cible, zone, prestations, pages,
  fonctionnalités, échéance, budget et contenus. [`vault/20-clients/target-clients.md`]
- Le fondateur doit expliquer la différence entre landing page et mini-site et
  leurs exclusions sans promesse non validée. [`vault/30-offers/offer.md`]
- Les textes, photos et preuves nécessaires sont des sujets d'apprentissage
  proposés, pas une validation marché. [`vault/40-seo-market/seo-ideas.md`]

## Plan proposé

1. Rédiger puis tester un questionnaire de cadrage sur un cas fictif.
   [`vault/20-clients/target-clients.md`]
2. Produire une fiche comparant landing page et mini-site, inclus et exclus.
   [`vault/30-offers/offer.md`]
3. Préparer une checklist des textes, photos et preuves à demander.
   [`vault/40-seo-market/seo-ideas.md`]
4. Rédiger un brouillon commercial non envoyé et le relire contre la fiche.
   [`vault/70-learning/learning-plan.md`]

## Suggestions du Coach

- Utiliser le cas fictif artisan pour vérifier les quatre livrables en une semaine.

## Sources utilisées

- `vault/40-seo-market/seo-ideas.md`
- `vault/20-clients/target-clients.md`
- `vault/30-offers/offer.md`
- `vault/70-learning/learning-plan.md`

## Limites

- Deux sources sont `proposed` et ne prouvent aucun résultat marché.
- La récupération lexicale peut manquer des synonymes.
- Budget, délai et segment prioritaire ne sont pas validés dans la question.

## Respect du format

- Conforme : les sept rubriques du workflow sont présentes.
- Conforme : moteur, nombre de documents, rangs, scores, statuts et chemins sont reproduits.
- Conforme : quatre notes au maximum, toutes citées et réellement retournées.
- Conforme : aucune écriture dans le vault ni connaissance externe ajoutée.

## Limites observées

Le premier résultat est une proposition SEO, pas une décision. Le Coach l'a
conservé dans le classement tout en distinguant son statut des notes validées.
