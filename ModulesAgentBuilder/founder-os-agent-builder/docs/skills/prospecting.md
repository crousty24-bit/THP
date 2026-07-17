# Skill — Prospecting

## Quand l'utiliser

Utiliser ce skill pour préparer des segments, personas, signaux de qualification
et angles d'approche. Ne pas l'utiliser pour scraper, enrichir ou contacter une
personne réelle.

## Entrées attendues

- offre et bénéfice attendu ;
- cible, zone et critères de segmentation ;
- origine et statut des données éventuelles ;
- exclusions, contraintes de protection des données et objectif du test.

## Sortie attendue

Produire les rubriques `Périmètre`, `Segments`, `Signaux de qualification`,
`Angles d'approche`, `Données et permissions`, `Prochaine action` et `Limites`.
Chaque segment indique cible, problème, signal, adéquation qualitative et statut
fictif ou autorisé des données.

## Méthode

1. Vérifier l'origine et le droit d'utilisation des données.
2. Partir de l'offre et du problème résolu, pas d'une liste arbitraire.
3. Définir des segments mutuellement compréhensibles et leurs exclusions.
4. Associer des signaux observables et un angle non trompeur à chaque segment.
5. Marquer explicitement les personas et exemples fictifs.
6. Limiter la prochaine action à une validation ou un test local.

## Garde-fous

- Ne pas produire de coordonnées réelles non fournies et autorisées.
- Ne pas scraper, acheter, enrichir, exporter ou envoyer de message.
- Ne pas déduire de donnée sensible ni garantir la qualité d'un lead.
- Exiger une approbation ciblée avant tout traitement de prospects réels.
- Représenter ce blocage avec `request_human_approval`, sans importer, enrichir
  ni contacter avant la décision explicite.

## Exemple

Pour Web Studio OS, créer un segment fictif « artisans avec site obsolète »,
signal « offre difficile à comprendre sur mobile » et angle « clarifier les
prestations », sans nom, adresse, email ni collecte externe.
