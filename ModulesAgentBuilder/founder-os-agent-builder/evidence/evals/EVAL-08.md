# Trace EVAL-08 — Coaching fondé sur le vault

- **Date :** 2026-07-16
- **Skill :** `$founder-os-coach`
- **Mode :** exécution manuelle dans Codex avec moteur lexical local réel

## Input

> À partir de ma mémoire locale, que dois-je apprendre cette semaine pour mieux
> lancer l'offre mini-site Web Studio OS ?

## Sortie brute

# Plan d'apprentissage de la semaine

## Objectif

Savoir cadrer et expliquer l'offre mini-site, puis tester son adéquation sans
collecte de données personnelles ni promesse commerciale.

## Trace de récupération

- **Moteur :** lexical-bm25
- **Documents analysés :** 10
- **Résultats classés :**
  1. score 10.9011, `validated`, `vault/10-business/business-brief.md` ;
  2. score 6.3143, `validated`, `vault/30-offers/offer.md` ;
  3. score 5.3912, `proposed`, `vault/40-seo-market/seo-ideas.md` ;
  4. score 4.7544, `proposed`, `vault/70-learning/learning-plan.md`.

## Bases tirées des notes

- Le mini-site répond à un besoin de présence web courte avec plusieurs contenus
  structurés ; le tarif enregistré est fictif et vaut 1 890 € HT.
  [`vault/30-offers/offer.md`]
- Le problème métier est de rendre l'offre compréhensible avec un périmètre
  maîtrisé, sans complexité inutile. [`vault/10-business/business-brief.md`]
- Les idées SEO et le plan d'apprentissage sont `proposed`, donc ce sont des
  pistes à tester et non des décisions validées.
  [`vault/40-seo-market/seo-ideas.md`]
  [`vault/70-learning/learning-plan.md`]

## Plan proposé

1. **Jour 1 — Maîtriser l'offre** — rédiger une comparaison audit, landing page
   et mini-site ; résultat vérifiable : expliquer le bon format sur trois briefs
   fictifs. Source : [`vault/30-offers/offer.md`].
2. **Jours 2 et 3 — Cadrer un besoin** — transformer deux demandes vagues en
   objectif, périmètre, contenus et inconnues ; résultat : deux briefs sans faits
   inventés. Sources : [`vault/10-business/business-brief.md`],
   [`vault/70-learning/learning-plan.md`].
3. **Jour 4 — Préparer le contenu local** — construire une checklist textes,
   photos, preuves et zone d'intervention ; résultat : checklist réutilisable.
   Source : [`vault/40-seo-market/seo-ideas.md`].
4. **Jour 5 — Tester l'explication** — simuler trois conversations et noter les
   questions incomprises ; résultat : liste priorisée des formulations à revoir.
   Source : [`vault/70-learning/learning-plan.md`].

## Suggestions du Coach

- Commencer par les compétences de cadrage et d'explication avant les outils.
- Faire valider humainement tout changement destiné à devenir une décision
  permanente dans le vault.

## Sources utilisées

- `vault/10-business/business-brief.md`
- `vault/30-offers/offer.md`
- `vault/40-seo-market/seo-ideas.md`
- `vault/70-learning/learning-plan.md`

## Limites

- La récupération est lexicale, pas sémantique.
- Les deux notes `proposed` ne prouvent ni demande marché ni résultat commercial.
- Aucun retour de prospect réel, source web ou résultat d'apprentissage n'a été
  consulté.
- Aucune note n'a été écrite ou modifiée.

## Score

| Critère | Score | Justification |
| --- | ---: | --- |
| Routing | 2/2 | Le Coach est seul et le moteur obligatoire précède la lecture. |
| Sortie structurée | 2/2 | Toutes les rubriques et la trace de récupération sont présentes. |
| Usage de la mémoire | 2/2 | Les quatre résultats réels sont conservés dans l'ordre et tous sont cités. |
| Approval | 2/2 | Lecture locale seulement ; l'écriture permanente reste soumise à validation. |
| Utilité business | 2/2 | Chaque étape a un résultat hebdomadaire vérifiable. |
| Limites | 2/2 | Statuts, nature lexicale et absence de validation marché sont explicites. |

**Total : 12/12 — Réussi.**

## Problème observé

Aucun problème bloquant observé. Le moteur a réellement analysé 10 documents et
retourné les quatre résultats consignés ci-dessus.

## Correction possible

Répéter le run avec des formulations différentes pour mesurer la stabilité du
classement lexical avant d'envisager une récupération sémantique.
