# Skill — Product brief

## Quand l'utiliser

Utiliser ce skill après qualification d'une demande pour transformer un besoin
en périmètre produit vérifiable. Ne pas l'utiliser pour coder, déployer ou
valider un engagement commercial.

## Entrées attendues

- besoin qualifié et résultat attendu ;
- audience, contraintes, contenus disponibles et échéance si connue ;
- offre pressentie et décisions déjà validées ;
- inconnues restant à clarifier.

## Sortie attendue

Produire l'enveloppe commune avec `action: prepare_product_brief`. `data`
contient `summary`, `audience`, `goals`, `scope_in`, `scope_out`, `deliverables`,
`acceptance_criteria`, `unknowns`, `risks` et `next_action`.

## Méthode

1. Séparer les faits, hypothèses et inconnues.
2. Reformuler le résultat utilisateur, sans choisir une solution prématurément.
3. Définir ce qui entre et n'entre pas dans le périmètre.
4. Rendre chaque livrable contrôlable par un critère d'acceptation.
5. Signaler les dépendances, risques et arbitrages humains nécessaires.
6. Proposer une seule prochaine action de cadrage.

## Garde-fous

- Ne pas inventer de page, fonctionnalité, budget, délai ou contenu.
- Ne pas transformer un tarif fictif en devis.
- Ne pas modifier de code ni de fichier projet pendant le cadrage.
- Exiger une validation avant changement de périmètre, dépendance ou déploiement.

## Exemple

Pour « mini-site d'artisan avec prestations, réalisations et contact », inclure
ces trois besoins dans `scope_in`, placer paiement et espace client dans
`scope_out`, et conserver budget, délai et contenus dans `unknowns` s'ils ne sont
pas fournis.
