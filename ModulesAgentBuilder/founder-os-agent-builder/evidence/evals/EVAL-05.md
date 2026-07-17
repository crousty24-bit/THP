# Trace EVAL-05 — Réponse commerciale locale

- **Date :** 2026-07-16
- **Skill :** `$founder-os-sales`
- **Mode :** exécution manuelle dans Codex, contexte local du dépôt, sans Gmail

## Input

> Rédige une réponse locale à Camille, prospect fictif, qui demande le prix d'un
> mini-site mais ne précise ni pages, ni délai, ni contenus. Utilise le tarif
> fictif du brief et n'envoie rien.

## Sortie brute

```json
{
  "schema_version": "1.0",
  "action": "draft_email_reply",
  "status": "needs_input",
  "approval_required": false,
  "warnings": [
    "Brouillon local uniquement : aucun mail ni brouillon Gmail n'a été créé.",
    "Le tarif est fictif, indicatif et doit être confirmé après cadrage."
  ],
  "data": {
    "to": [
      "camille@example.test"
    ],
    "cc": [],
    "subject": "Votre projet de mini-site",
    "body": "Bonjour Camille,\n\nMerci pour votre message. Le tarif fictif de référence d'un mini-site Web Studio OS est de 1 890 € HT, à confirmer après cadrage. Pour vérifier que ce format correspond à votre besoin, pourriez-vous préciser les pages souhaitées, votre échéance et les contenus déjà disponibles ?\n\nBien cordialement,\nWeb Studio OS",
    "unresolved_points": [
      "Périmètre et nombre de pages",
      "Échéance",
      "Contenus disponibles"
    ],
    "source_message_id": null,
    "gmail_draft_created": false
  }
}
```

## Score

| Critère | Score | Justification |
| --- | ---: | --- |
| Routing | 2/2 | Sales prépare le brouillon ; Produit est différé jusqu'au cadrage. |
| Sortie structurée | 2/2 | L'enveloppe `email_draft` est complète et cohérente. |
| Usage de la mémoire | 1/2 | Le prix et le ton sont conformes, mais leurs chemins sources ne sont pas visibles. |
| Approval | 1/2 | Le brouillon local est correctement autorisé, mais la sortie ne rappelle pas les éléments exacts à approuver avant Gmail. |
| Utilité business | 2/2 | Le message est court, honnête et demande les trois informations manquantes. |
| Limites | 2/2 | Le prix est qualifié et aucun délai ou périmètre n'est inventé. |

**Total : 10/12 — Réussi.**

## Problème observé

`approval_required: false` est juste pour le livrable local, mais la sortie ne
rend pas assez visible que destinataire, objet et contenu exact doivent être
approuvés avant une éventuelle création dans Gmail.

## Correction possible

Ajouter un avertissement séparé décrivant précisément l'approval Gmail future,
sans changer `approval_required` pour l'action locale courante.
