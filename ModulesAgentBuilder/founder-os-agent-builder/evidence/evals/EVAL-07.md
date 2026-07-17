# Trace EVAL-07 — Brief produit incomplet

- **Date :** 2026-07-16
- **Skill :** `$founder-os-product`
- **Mode :** exécution manuelle dans Codex, contexte local du dépôt, sans modification

## Input

> Transforme cette demande en brief produit : un artisan fictif veut un site
> vitrine pour présenter ses prestations et recevoir des demandes de contact.
> Le budget, le délai, les contenus et le nombre de pages sont inconnus.

## Sortie brute

```json
{
  "schema_version": "1.0",
  "action": "prepare_product_brief",
  "status": "needs_input",
  "approval_required": false,
  "warnings": [
    "Brief de cadrage uniquement : aucun fichier, code ou déploiement n'a été modifié."
  ],
  "data": {
    "summary": "Site vitrine d'un artisan fictif présentant ses prestations et permettant une demande de contact.",
    "audience": [
      "Personnes recherchant les prestations de l'artisan ; profil et zone à confirmer"
    ],
    "goals": [
      "Comprendre les prestations",
      "Trouver un moyen de demander un contact"
    ],
    "scope_in": [
      "Présentation structurée des prestations",
      "Moyen de demande de contact",
      "Structure de contenu à confirmer après inventaire"
    ],
    "scope_out": [
      "Paiement en ligne",
      "Espace client",
      "Automatisation de devis",
      "Publication et déploiement"
    ],
    "deliverables": [
      "Arborescence proposée après clarification du nombre de pages",
      "Brief des contenus",
      "Checklist de recette"
    ],
    "acceptance_criteria": [
      "Un visiteur peut identifier les prestations explicitement validées.",
      "Un visiteur peut trouver le moyen de contact validé.",
      "Chaque contenu publié dispose d'une source et de droits confirmés."
    ],
    "unknowns": [
      "Budget",
      "Délai",
      "Contenus disponibles et droits",
      "Nombre et liste des pages",
      "Zone d'intervention",
      "Modalité exacte de contact"
    ],
    "risks": [
      "Choisir une structure avant l'inventaire des contenus",
      "Utiliser des textes ou images sans droits confirmés"
    ],
    "next_action": "Faire compléter et valider les inconnues avant de proposer l'arborescence définitive."
  }
}
```

## Score

| Critère | Score | Justification |
| --- | ---: | --- |
| Routing | 2/2 | Produit réalise seul le cadrage et n'exécute pas SEO ou Sales. |
| Sortie structurée | 2/2 | Tous les champs du brief produit sont présents. |
| Usage de la mémoire | 2/2 | Aucun fait métier non nécessaire n'est importé ; la sortie reste fondée sur l'entrée. |
| Approval | 2/2 | Le brief local est permis et les changements restent hors périmètre. |
| Utilité business | 2/2 | Le cadrage transforme la demande vague en éléments vérifiables. |
| Limites | 2/2 | Toutes les inconnues fournies restent inconnues et aucune page n'est inventée. |

**Total : 12/12 — Réussi.**

## Problème observé

Aucun problème bloquant observé.

## Correction possible

Après réponse humaine aux inconnues, produire un nouveau brief versionné plutôt
que remplacer silencieusement ce cadrage initial.
