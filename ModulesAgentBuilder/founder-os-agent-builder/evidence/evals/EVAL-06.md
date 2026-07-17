# Trace EVAL-06 — Devis fictif et calculs

- **Date :** 2026-07-16
- **Skill :** `$founder-os-admin`
- **Mode :** exécution manuelle dans Codex, contexte local du dépôt, sans transmission

## Input

> Génère un devis fictif non contractuel pour le prospect artisan TEST : un
> mini-site à 1 890 € HT et deux pages supplémentaires à 190 € HT chacune.
> N'ajoute ni taxe, ni identité légale, ni conditions.

## Sortie brute

```json
{
  "schema_version": "1.0",
  "action": "create_mock_quote",
  "status": "success",
  "approval_required": false,
  "warnings": [
    "DEVIS FICTIF — NON CONTRACTUEL",
    "Taxes, identité légale, conditions, signature et délai non renseignés.",
    "Simulation locale : aucune transmission ni opération financière."
  ],
  "data": {
    "quote_id": "MOCK-EVAL-06",
    "fictitious": true,
    "customer_label": "Prospect artisan TEST",
    "currency": "EUR",
    "lines": [
      {
        "description": "Mini-site",
        "quantity": 1,
        "unit_price_excl_tax": 1890,
        "line_total_excl_tax": 1890
      },
      {
        "description": "Page supplémentaire",
        "quantity": 2,
        "unit_price_excl_tax": 190,
        "line_total_excl_tax": 380
      }
    ],
    "total_excl_tax": 2270,
    "source": "docs/business-brief.md et entrée EVAL-06"
  }
}
```

## Score

| Critère | Score | Justification |
| --- | ---: | --- |
| Routing | 2/2 | Admin / Compta est le seul agent nécessaire. |
| Sortie structurée | 2/2 | L'enveloppe `mock_quote` respecte le schéma. |
| Usage de la mémoire | 2/2 | La source locale du tarif est explicitement citée. |
| Approval | 2/2 | La simulation locale est permise et aucune transmission n'est prétendue. |
| Utilité business | 2/2 | Quantités, prix unitaires et totaux sont lisibles et exacts. |
| Limites | 2/2 | Le caractère fictif et toutes les données légales absentes sont signalés. |

**Total : 12/12 — Réussi.**

## Problème observé

Aucun problème bloquant observé. Le calcul `1 890 + (2 × 190) = 2 270` est exact.

## Correction possible

Conserver un contrôle automatisé des sommes si le schéma est ultérieurement
utilisé par un outil plutôt que seulement dans une simulation manuelle.
