# Skill — Admin sandbox

## Quand l'utiliser

Utiliser ce skill pour simuler un devis, un suivi de paiement ou une checklist
administrative à des fins pédagogiques. Ne pas l'utiliser pour produire un
document légal, fiscal ou comptable réel.

## Entrées attendues

- libellé client fictif ou assaini ;
- offre, quantité, prix HT, devise et source du tarif ;
- périmètre et hypothèses ;
- statut simulé de paiement si nécessaire.

## Sortie attendue

Pour un devis, produire exactement l'enveloppe `mock_quote` avec
`action: create_mock_quote`, `fictitious: true`, lignes chiffrées,
`total_excl_tax`, source et avertissements.

## Méthode

1. Vérifier la source et le statut fictif du prix.
2. Refuser ou laisser inconnue toute donnée légale absente.
3. Calculer chaque total de ligne puis leur somme.
4. Ajouter « DEVIS FICTIF — NON CONTRACTUEL ».
5. Contrôler devise, quantités, calculs, source et limites.
6. Arrêter avant toute émission, transmission ou opération financière réelle.

## Garde-fous

- Ne jamais inventer numéro légal, taxe, identité, signature ou conditions.
- Ne pas transformer le brouillon en devis réel ni effectuer de paiement.
- Ne pas fournir de conseil comptable, fiscal ou juridique professionnel.
- Exiger une validation avant utilisation de données légales ou transmission.

## Exemple

Une ligne « Mini-site », quantité 1, prix unitaire 1 890 € HT produit un total
HT de 1 890 €, avec `fictitious: true` et la source `docs/business-brief.md`.
