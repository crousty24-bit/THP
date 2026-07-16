# Run — Day 2 Coach Lexical RAG

## Métadonnées et stack

- **Date :** 15 juillet 2026
- **Agent :** Founder OS Coach
- **Configuration :** `.agents/skills/founder-os-coach/SKILL.md`
- **Récupération :** BM25 lexical automatisé, Python standard
- **Moteur :**
  `.agents/skills/founder-os-coach/scripts/retrieve_notes.py`
- **Mémoire :** 10 fichiers Markdown locaux sous `vault/`
- **Recherche sémantique :** non
- **Index persistant :** aucun
- **Clé API ou dépendance supplémentaire :** aucune

## Question posée

> À partir de mes notes, que dois-je apprendre cette semaine pour mieux lancer
> mon offre ?

## Commande de récupération

```bash
python3 .agents/skills/founder-os-coach/scripts/retrieve_notes.py \
  "À partir de mes notes, que dois-je apprendre cette semaine pour mieux lancer mon offre ?" \
  --vault vault --limit 4
```

## Trace de récupération obtenue

- **Moteur :** `lexical-bm25`
- **Documents analysés :** 10

| Rang | Score | Statut | Note | Termes trouvés |
| ---: | ---: | --- | --- | --- |
| 1 | 3.3455 | validated | `vault/10-business/business-brief.md` | lancer, offre |
| 2 | 2.7862 | proposed | `vault/70-learning/learning-plan.md` | offre, semaine |
| 3 | 2.3035 | validated | `vault/30-offers/offer.md` | lancer, offre |
| 4 | 1.5748 | validated | `vault/20-clients/target-clients.md` | apprendre |

Le classement ci-dessus est la sortie réelle du moteur. Le Coach a ensuite lu
uniquement ces quatre notes.

## Réponse obtenue

# Plan d'apprentissage de la semaine

## Objectif

Apprendre à transformer le besoin d'un client cible en une offre simple,
périmétrée et présentable sans engagement non validé.

## Trace de récupération

- **Moteur :** lexical-bm25
- **Documents analysés :** 10
- **Résultats classés :**
  1. 3.3455 — validated — `vault/10-business/business-brief.md`
  2. 2.7862 — proposed — `vault/70-learning/learning-plan.md`
  3. 2.3035 — validated — `vault/30-offers/offer.md`
  4. 1.5748 — validated — `vault/20-clients/target-clients.md`

## Bases tirées des notes

- La priorité métier est de lancer une offre simple et répétable qui relie le
  besoin client à un périmètre, un résultat et une prochaine action.
  [`vault/10-business/business-brief.md`]
- Le plan d'apprentissage propose de travailler le cadrage, la maîtrise de
  l'offre, la validation d'un segment et le lien entre intention et message. Ce
  plan a le statut `proposed`, pas celui d'une décision validée.
  [`vault/70-learning/learning-plan.md`]
- Le catalogue distingue audit UX/SEO, landing page, mini-site et automatisation,
  avec des prix fictifs et un périmètre à confirmer.
  [`vault/30-offers/offer.md`]
- Les clients visés sont les indépendants, artisans et petites entreprises sans
  équipe numérique ; la qualification doit couvrir objectif, cible, zone,
  prestations, fonctionnalités, budget, échéance et contenus disponibles.
  [`vault/20-clients/target-clients.md`]

## Plan proposé

1. **Lundi — qualifier un besoin** : rédiger puis tester sur une demande fictive
   un questionnaire court couvrant les informations client manquantes.
   [`vault/20-clients/target-clients.md`]
2. **Mardi — expliquer l'offre** : produire une fiche comparative entre audit,
   landing page et mini-site, avec résultat, limites et hors-périmètre, sans
   transformer les tarifs fictifs en devis. [`vault/30-offers/offer.md`]
3. **Mercredi — relier besoin et résultat** : prendre une demande fictive et
   formuler une offre simple avec un périmètre, un résultat observable et une
   seule prochaine action. [`vault/10-business/business-brief.md`]
4. **Jeudi et vendredi — tester le plan proposé** : analyser cinq retours ou
   sources autorisées, en produire une synthèse anonymisée et noter ce qui doit
   être appris la semaine suivante. [`vault/70-learning/learning-plan.md`]

## Suggestions du Coach

- Commencer par le cadrage et les frontières de l'offre avant d'élargir le
  catalogue.
- Utiliser des scénarios fictifs si aucun échange réel autorisé n'est disponible.
- Proposer ensuite une mise à jour de `learning-plan.md`, sans l'écrire avant
  validation humaine.

Ces éléments sont des suggestions du Coach, pas des décisions présentes dans le
vault.

## Sources utilisées

- `vault/10-business/business-brief.md`
- `vault/70-learning/learning-plan.md`
- `vault/30-offers/offer.md`
- `vault/20-clients/target-clients.md`

## Limites

- Le segment prioritaire, la zone géographique et le temps disponible restent
  inconnus.
- Aucun retour de prospect réel ne valide encore les hypothèses du plan.
- Le moteur est lexical : une reformulation sans terme ou racine commune peut ne
  pas retrouver la bonne note.

## Analyse du run

La récupération est automatique et reproductible : la question seule détermine
le classement, et le Coach ne choisit pas manuellement ses sources. Les quatre
notes retournées existent, ont été lues et sont citées. Le statut `proposed` du
plan d'apprentissage est conservé dans la réponse.

Le moteur automatise la partie Retrieval et Codex assure la partie Generation ;
le contexte récupéré augmente la réponse. Cela constitue un RAG lexical sans
prétendre fournir une recherche sémantique.

## Données traitées

Le parcours, la normalisation, le calcul BM25 et le classement ont été exécutés
localement. Aucun texte n'a été envoyé à une API d'embeddings et aucun index
cloud n'a été créé.

Pour générer la réponse, la question, les instructions de la skill et le contenu
des quatre notes classées ont été traités par la session Codex/OpenAI existante.
Les notes ne contiennent ni identité réelle, ni contact, ni secret. Le coût et le
nombre de tokens ne sont pas exposés : **je ne sais pas** les vérifier.
