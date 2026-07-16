# Run — Day 3 Product Agent

## Input

> Un artisan fictif veut un mini-site pour présenter ses prestations de
> rénovation, ses réalisations et un formulaire de contact. Budget, délai et
> contenus disponibles inconnus.

## Skill utilisé

- Agent : `$founder-os-product`
- Workflow : `docs/skills/product-brief.md`
- Mode : simulation contrôlée dans Codex, sans modification de fichier produit

## Sortie

```json
{
  "schema_version": "1.0",
  "action": "prepare_product_brief",
  "status": "needs_input",
  "approval_required": false,
  "warnings": ["Le périmètre et le tarif doivent être validés avant production."],
  "data": {
    "summary": "Mini-site d'un artisan fictif présentant prestations, réalisations et contact.",
    "audience": ["Prospects recherchant des prestations de rénovation"],
    "goals": ["Comprendre les prestations", "Voir des réalisations", "Demander un contact"],
    "scope_in": ["Présentation des prestations", "Galerie de réalisations", "Formulaire de contact"],
    "scope_out": ["Paiement en ligne", "Espace client", "Publication ou déploiement"],
    "deliverables": ["Arborescence", "Brief de pages", "Liste des contenus requis", "Checklist de recette"],
    "acceptance_criteria": ["Les prestations sont identifiables", "Les réalisations sont consultables", "Le moyen de contact est visible"],
    "unknowns": ["Budget", "Échéance", "Zone d'intervention", "Nombre de réalisations", "Contenus disponibles", "Droits sur les médias"],
    "risks": ["Photos sans droits confirmés", "Périmètre incomplet avant estimation"],
    "next_action": "Faire valider le périmètre et compléter les six inconnues."
  }
}
```

## Respect du format

- Conforme : enveloppe commune et action attendue présentes.
- Conforme : périmètres inclus et exclus séparés.
- Conforme : critères vérifiables, inconnues et une seule prochaine action.
- Conforme : aucune modification, aucun prix ni délai inventé.

## Limites observées

Le brief ne peut pas fixer l'arborescence détaillée, le tarif ou le calendrier
tant que la zone, les contenus, le budget et l'échéance restent inconnus.
