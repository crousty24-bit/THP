# Run — Day 3 Sales Agent

## Input

> Rédige une réponse à `prospect@example.test`. Le prospect demande le prix d'un
> mini-site mais n'a donné ni délai, ni pages, ni contenus disponibles.

## Skill utilisé

- Agent : `$founder-os-sales`
- Workflow : `docs/skills/sales-copy.md`
- Mode : brouillon local ; aucun accès ni envoi Gmail

## Sortie

```json
{
  "schema_version": "1.0",
  "action": "draft_email_reply",
  "status": "needs_input",
  "approval_required": false,
  "warnings": ["Brouillon uniquement : aucun mail n'a été créé ni envoyé."],
  "data": {
    "to": ["prospect@example.test"],
    "cc": [],
    "subject": "Re: Votre projet de mini-site",
    "body": "Bonjour,\n\nMerci pour votre demande. Le tarif fictif de référence d'un mini-site Web Studio OS est de 1 890 € HT, à confirmer après cadrage. Pour définir un périmètre adapté, pourriez-vous préciser les pages souhaitées, votre échéance et les contenus déjà disponibles ?\n\nBien cordialement,\nWeb Studio OS",
    "unresolved_points": ["Pages souhaitées", "Échéance", "Contenus disponibles", "Périmètre final et prix validé"],
    "source_message_id": null,
    "gmail_draft_created": false
  }
}
```

## Respect du format

- Conforme : enveloppe `email_draft`, destinataire `.test`, objet et corps.
- Conforme : tarif présenté comme fictif et à confirmer.
- Conforme : points inconnus explicites et `gmail_draft_created: false`.
- Conforme : aucune promesse de délai, création cloud ou envoi.

## Limites observées

L'objet est simulé et aucun fil source n'est disponible. Le périmètre, le prix
final et l'échéance nécessitent cadrage et validation humaine.
