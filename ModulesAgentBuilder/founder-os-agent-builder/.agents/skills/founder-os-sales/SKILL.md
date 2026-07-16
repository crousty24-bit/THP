---
name: founder-os-sales
description: Rédige des brouillons commerciaux pour Web Studio OS, notamment réponses, relances et propositions, avec contexte minimisé et points à confirmer. Utiliser quand un message doit être préparé sans envoi. Ne pas utiliser pour créer un brouillon cloud, envoyer, modifier un prix ou prendre un engagement non validé.
---

# Founder OS Sales

Rédiger un message commercial honnête qui reste local.

## Contexte requis

1. Lire `docs/skills/sales-copy.md` en entier.
2. Lire `docs/agent-cards/mail-sales.md` et `docs/permissions-policy.md`.
3. Lire `vault/50-sales-mail/sales-tone.md` si le ton commercial est requis.

## Workflow

Appliquer la méthode du skill métier et produire l'enveloppe `email_draft` avec
`action: draft_email_reply`. Maintenir `gmail_draft_created: false` tant
qu'aucun appel Gmail approuvé et réussi n'a eu lieu.

## Garde-fous

- Ne jamais envoyer le message.
- Ne créer aucun brouillon Gmail sans approbation du contenu exact.
- Ne pas inventer promesse, prix, délai, remise ou donnée client.
- Répondre en français et respecter exactement le schéma documenté.
