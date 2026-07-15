# Sorties structurées

## Enveloppe commune

Les actions structurées utilisent la même enveloppe JSON. Les champs
`schema_version`, `action`, `status`, `approval_required`, `warnings` et `data`
sont obligatoires.

```json
{
  "schema_version": "1.0",
  "action": "action_name",
  "status": "success",
  "approval_required": false,
  "warnings": [],
  "data": {}
}
```

`status` accepte uniquement `success`, `needs_input`, `blocked` ou `error`.
`approval_required` indique qu'une prochaine action est bloquée en attente d'un
accord humain ; il ne prouve jamais que cet accord a été donné. Les faits
inconnus restent à `null` ou dans une liste de points manquants et ne sont pas
estimés silencieusement.

## Qualification de lead — `lead_qualification`

Contraintes : `score` est un entier de 0 à 100 ; `fit` accepte `low`, `medium` ou
`high` ; les informations absentes figurent dans `missing_information`.

```json
{
  "schema_version": "1.0",
  "action": "qualify_lead",
  "status": "needs_input",
  "approval_required": false,
  "warnings": [
    "Le score est une aide au tri, pas une décision commerciale."
  ],
  "data": {
    "lead_summary": "Artisan cherchant un mini-site pour présenter ses prestations.",
    "score": 70,
    "fit": "high",
    "needs": [
      "Présenter les prestations",
      "Recevoir des demandes de contact"
    ],
    "budget_eur": null,
    "deadline": null,
    "missing_information": [
      "Budget",
      "Échéance",
      "Nombre de pages",
      "Contenus disponibles"
    ],
    "recommended_next_action": "Envoyer un questionnaire de cadrage après validation du brouillon."
  }
}
```

## Brouillon de mail — `email_draft`

Contraintes : `to` et `subject` doivent être confirmés avant une écriture Gmail.
`source_message_id` vaut `null` pour un test simulé et ne doit pas être enregistré
dans une preuve réelle. `gmail_draft_created` reste `false` tant que
`gmail_create_draft` n'a pas réussi.

```json
{
  "schema_version": "1.0",
  "action": "draft_email_reply",
  "status": "needs_input",
  "approval_required": false,
  "warnings": [
    "Brouillon uniquement : aucun mail n'a été envoyé."
  ],
  "data": {
    "to": [
      "prospect@example.test"
    ],
    "cc": [],
    "subject": "Re: Votre projet de mini-site",
    "body": "Bonjour,\n\nMerci pour votre message. Pour vous proposer un périmètre adapté, pourriez-vous préciser votre échéance, les pages souhaitées et les contenus déjà disponibles ? Notre tarif fictif de référence pour un mini-site est de 1 890 € HT et devra être confirmé après cadrage.\n\nBien cordialement,\nWeb Studio OS",
    "unresolved_points": [
      "Échéance",
      "Périmètre exact",
      "Contenus disponibles"
    ],
    "source_message_id": null,
    "gmail_draft_created": false
  }
}
```

## Devis fictif — `mock_quote`

Contraintes : `fictitious` doit toujours valoir `true`, chaque montant est
exprimé hors taxes et `total_excl_tax` est la somme de `line_total_excl_tax`.
Ce schéma ne peut pas représenter un devis réel ou contractuel.

```json
{
  "schema_version": "1.0",
  "action": "create_mock_quote",
  "status": "success",
  "approval_required": false,
  "warnings": [
    "DEVIS FICTIF — NON CONTRACTUEL",
    "Taxes, identité légale, conditions et délai non renseignés."
  ],
  "data": {
    "quote_id": "MOCK-2026-001",
    "fictitious": true,
    "customer_label": "Prospect artisan fictif",
    "currency": "EUR",
    "lines": [
      {
        "description": "Mini-site",
        "quantity": 1,
        "unit_price_excl_tax": 1890,
        "line_total_excl_tax": 1890
      }
    ],
    "total_excl_tax": 1890,
    "source": "docs/business-brief.md"
  }
}
```

## Recherche dans la mémoire — `knowledge_search`

Contraintes : chaque résultat cite un chemin local autorisé. `answer` ne doit
pas dépasser ce que les extraits permettent d'affirmer. Une recherche sans
résultat utilise `status: needs_input` et explique ses limites.

```json
{
  "schema_version": "1.0",
  "action": "search_knowledge_base",
  "status": "success",
  "approval_required": false,
  "warnings": [],
  "data": {
    "query": "Quel est le tarif fictif du mini-site ?",
    "answer": "Le tarif fictif du mini-site est de 1 890 € HT.",
    "sources": [
      {
        "path": "docs/business-brief.md",
        "excerpt": "Mini-site | 1 890 €"
      }
    ],
    "limitations": [
      "Ce tarif est fictif et doit être confirmé après cadrage."
    ]
  }
}
```
