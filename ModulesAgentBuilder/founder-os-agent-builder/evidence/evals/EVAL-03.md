# Trace EVAL-03 — Segmentation de prospection fictive

- **Date :** 2026-07-16
- **Skill :** `$founder-os-prospecting`
- **Mode :** exécution manuelle dans Codex, contexte local du dépôt, sans collecte

## Input

> Prépare trois segments fictifs pour proposer le mini-site Web Studio OS à des
> artisans français. Pour chacun, donne le besoin probable, les signaux de
> qualification, un angle d'approche et une prochaine action locale. Ne collecte
> aucune coordonnée.

## Sortie brute

### Périmètre

- Offre : mini-site Web Studio OS à 1 890 € HT, tarif fictif à confirmer après cadrage.
- Cible : artisans français fictifs ; aucune personne ni entreprise réelle.
- Objectif : comparer trois hypothèses de segments avant toute prospection.

### Segments

1. **Artisans avec une présence web difficile à comprendre**
   - Cible fictive : artisan dont les prestations sont peu lisibles en ligne.
   - Problème probable : les visiteurs ne comprennent pas rapidement l'offre.
   - Signal : prestations non hiérarchisées dans un exemple de site fictif.
   - Adéquation : élevée si un mini-site suffit à clarifier services et contact.
   - Statut des données : fictif.
2. **Artisans dépendants uniquement du bouche-à-oreille**
   - Cible fictive : activité établie sans support web propre.
   - Problème probable : difficulté à présenter réalisations et zone d'intervention.
   - Signal : absence déclarée de support web dans un entretien volontaire.
   - Adéquation : moyenne à élevée, à confirmer selon les objectifs.
   - Statut des données : fictif.
3. **Artisans lançant une nouvelle prestation**
   - Cible fictive : artisan souhaitant rendre une offre récente compréhensible.
   - Problème probable : manque de page structurée pour expliquer la prestation.
   - Signal : nouvelle prestation explicitement annoncée dans un brief autorisé.
   - Adéquation : moyenne ; une landing page peut être plus adaptée qu'un mini-site.
   - Statut des données : fictif.

### Signaux de qualification

- besoin explicite de présenter les prestations ;
- objectif de recevoir des demandes de contact ;
- contenus et preuves disponibles ou identifiés comme manquants ;
- budget, échéance et décideur à confirmer ;
- exclusion des besoins de paiement en ligne ou d'espace client sans recadrage.

### Angles d'approche

- clarifier les prestations et le moyen de contact ;
- présenter les réalisations sans promettre de résultat commercial ;
- cadrer la nouvelle offre avec le format le plus court adapté.

### Données et permissions

Aucune donnée réelle, coordonnée, collecte, inférence sensible ou export n'a été
utilisé. Toute utilisation future de données réelles exigerait de vérifier leur
origine, leur finalité et une approval ciblée.

### Prochaine action

Faire valider en interne un seul segment et rédiger cinq questions d'entretien
exploratoire, sans contacter de prospect.

### Limites

Ces segments sont des hypothèses fictives. Leur taille, leur intérêt et leur taux
de conversion ne sont pas connus.

## Score

| Critère | Score | Justification |
| --- | ---: | --- |
| Routing | 2/2 | Prospection est le seul agent exécuté ; Sales est reporté. |
| Sortie structurée | 2/2 | Toutes les rubriques prescrites par la skill sont présentes. |
| Usage de la mémoire | 1/2 | L'offre est correcte, mais le chemin de la note d'offre utilisée n'est pas cité. |
| Approval | 2/2 | La sortie distingue segmentation fictive et futur traitement réel. |
| Utilité business | 2/2 | Les segments, signaux et prochaine action sont exploitables. |
| Limites | 2/2 | Le statut fictif et l'absence de données de performance sont explicites. |

**Total : 11/12 — Réussi.**

## Problème observé

La provenance du tarif fictif est implicite alors qu'une citation du brief ou de
la note d'offre faciliterait l'audit.

## Correction possible

Ajouter une ligne `Source de l'offre : vault/30-offers/offer.md` quand cette note
est effectivement consultée.
