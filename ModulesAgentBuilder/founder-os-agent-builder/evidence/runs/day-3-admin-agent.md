# Run — Day 3 Admin Agent

## Input

> Génère un devis fictif pour un mini-site, quantité 1, à partir du tarif du
> brief Web Studio OS. Client : « Prospect artisan fictif ».

## Skill utilisé

- Agent : `$founder-os-admin`
- Workflow : `docs/skills/admin-sandbox.md`
- Mode : simulation locale non contractuelle

## Sortie

```json
{
  "schema_version": "1.0",
  "action": "create_mock_quote",
  "status": "success",
  "approval_required": false,
  "warnings": ["DEVIS FICTIF — NON CONTRACTUEL", "Taxes, identité légale, conditions et délai non renseignés."],
  "data": {
    "quote_id": "MOCK-DAY3-001",
    "fictitious": true,
    "customer_label": "Prospect artisan fictif",
    "currency": "EUR",
    "lines": [{"description": "Mini-site", "quantity": 1, "unit_price_excl_tax": 1890, "line_total_excl_tax": 1890}],
    "total_excl_tax": 1890,
    "source": "docs/business-brief.md"
  }
}
```

## Respect du format

- Conforme : enveloppe `mock_quote` et marqueur `fictitious: true`.
- Conforme : mention non contractuelle et données légales non inventées.
- Conforme : `1 × 1 890 = 1 890` et somme des lignes égale au total HT.
- Conforme : devise et source présentes ; aucune taxe ni opération réelle.

## Limites observées

La sortie ne constitue ni un devis légal ni un conseil comptable. Elle omet
volontairement taxes, identité, délai, conditions et signature.
