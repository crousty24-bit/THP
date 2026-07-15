# Tests du catalogue d'actions

## Cadre du test

- **Date :** 15 juillet 2026
- **Mode :** exécution manuelle simulée avec données fictives
- **Actions externes :** aucune
- **Gmail :** connecteur non appelé ; aucune boîte lue et aucun brouillon créé
- **Références :** `docs/tool-catalog.md`, `docs/structured-outputs.md` et
  `docs/business-brief.md`

Les verdicts vérifient la structure, les permissions et la cohérence métier. Ils
ne prouvent pas l'exécution d'une API ou d'un agent autonome.

## Test 1 — `qualify_lead`

### Input

> Je suis artisan en rénovation et je cherche un mini-site pour présenter mes
> prestations et recevoir des demandes. Je n'ai pas encore défini mon budget ni
> ma date de lancement.

### Sortie attendue

Une enveloppe `qualify_lead` au statut `needs_input`, sans budget ni délai
inventé, avec un score valide, un niveau d'adéquation et une prochaine action.

### Sortie obtenue

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
    "lead_summary": "Artisan en rénovation cherchant un mini-site pour présenter ses prestations et recevoir des demandes.",
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
    "recommended_next_action": "Préparer un questionnaire de cadrage pour validation."
  }
}
```

### Verdict

**Réussi.** L'enveloppe et les valeurs contrôlées sont conformes ; les inconnues
restent explicites et aucune donnée personnelle réelle n'est utilisée.

### Correction à faire si besoin

Aucune. Sur un lead réel, ajouter la provenance et vérifier l'autorisation de
traitement avant toute qualification.

## Test 2 — `draft_email_reply`

### Input

> Répondre au prospect fictif pour confirmer la réception de sa demande de
> mini-site et lui demander son échéance, les pages et les contenus disponibles.

### Sortie attendue

Un brouillon prêt à relire, clairement non envoyé, avec les points manquants et
`gmail_draft_created: false`. Aucun identifiant Gmail réel ne doit apparaître.

### Sortie obtenue

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
    "body": "Bonjour,\n\nMerci pour votre demande de mini-site. Pour cadrer le projet, pourriez-vous préciser votre échéance, les pages souhaitées et les contenus déjà disponibles ? Le tarif fictif de référence est de 1 890 € HT ; il devra être confirmé après cadrage.\n\nBien cordialement,\nWeb Studio OS",
    "unresolved_points": [
      "Échéance",
      "Pages souhaitées",
      "Contenus disponibles"
    ],
    "source_message_id": null,
    "gmail_draft_created": false
  }
}
```

### Verdict

**Réussi.** La sortie est un brouillon local structuré. Le domaine `.test` est
fictif, le connecteur Gmail n'a pas été appelé et aucune action d'envoi n'a été
préparée.

### Correction à faire si besoin

Aucune pour le test simulé. Dans un workflow réel, rechercher le message dans un
périmètre borné, lire le contexte utile, puis demander une validation explicite
avant `gmail_create_draft` avec le véritable `reply_message_id`.

## Test 3 — `create_mock_quote`

### Input

> Créer un devis fictif pour un mini-site destiné à un artisan fictif, à partir
> du tarif du brief.

### Sortie attendue

Une enveloppe `create_mock_quote`, marquée fictive et non contractuelle, avec une
ligne à 1 890 € HT et un total HT égal à 1 × 1 890 €.

### Sortie obtenue

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

### Verdict

**Réussi.** Le tarif correspond au brief, le calcul `1 × 1 890 = 1 890` est
correct et les marqueurs fictif/non contractuel sont présents.

### Correction à faire si besoin

Aucune. Une identité légale, des taxes ou des conditions réelles ne doivent pas
être ajoutées par défaut.

## Test 4 — `search_knowledge_base`

### Input

```json
{
  "query": "Quel est le tarif fictif du mini-site ?",
  "allowed_paths": [
    "docs/business-brief.md"
  ],
  "max_results": 3
}
```

### Sortie attendue

Une réponse limitée au fichier autorisé, avec le tarif fictif, le chemin de la
source, un extrait et la limite commerciale associée.

### Sortie obtenue

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

### Verdict

**Réussi.** La réponse est soutenue par le seul fichier autorisé, cite son chemin
et ne transforme pas le prix de référence en engagement.

### Correction à faire si besoin

Aucune. Si les sources autorisées se contredisent, retourner `needs_input` et
présenter les deux passages au lieu de choisir silencieusement.
