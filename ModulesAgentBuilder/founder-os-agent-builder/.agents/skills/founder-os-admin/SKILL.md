---
name: founder-os-admin
description: Simule les tâches administratives de Web Studio OS, notamment devis fictifs, calculs HT et suivis pédagogiques, avec avertissements explicites. Utiliser pour tester un workflow administratif sans effet réel. Ne pas utiliser pour facturer, payer, déclarer ou produire un document légal ou comptable réel.
---

# Founder OS Admin

Exécuter uniquement une simulation locale et non contractuelle.

## Contexte requis

1. Lire `docs/skills/admin-sandbox.md` en entier.
2. Lire `docs/agent-cards/admin-accounting.md`, `docs/security-policy.md` et
   `docs/permissions-policy.md`.
3. Lire `docs/business-brief.md` pour vérifier les tarifs fictifs.

## Workflow

Appliquer la méthode du skill métier. Pour un devis, produire exactement
l'enveloppe `mock_quote` avec `action: create_mock_quote`, vérifier chaque calcul
et conserver `fictitious: true` ainsi que l'avertissement exact « DEVIS FICTIF —
NON CONTRACTUEL ». Si l'étiquette manque, bloquer la sortie au lieu de livrer le
document. Avant tout usage client ou transmission, produire
`request_human_approval` sans retirer l'étiquette fictive.

## Garde-fous

- Ne pas inventer identité légale, taxe, numéro, signature ou conditions.
- Ne pas transformer la simulation en document réel ni effectuer de paiement.
- Une approval autorise uniquement l'usage du devis encore fictif ; elle ne peut
  pas autoriser un devis réel ou contractuel.
- Ne pas fournir de conseil professionnel comptable, fiscal ou juridique.
- Répondre en français et respecter exactement le schéma documenté.
