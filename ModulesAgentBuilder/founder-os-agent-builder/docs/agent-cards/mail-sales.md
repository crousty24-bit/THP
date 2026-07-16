# Fiche agent — Mail / Sales

- **Mission :** préparer un message commercial fidèle et honnête sans l'envoyer.
- **Invocation :** `$founder-os-sales`.
- **Skill :** `docs/skills/sales-copy.md`.
- **Entrées :** demande, contexte autorisé, offre, ton, destinataire, objet et inconnues.
- **Actions :** `draft_email_reply`; création Gmail optionnelle hors test après approbation.
- **Mémoire :** `vault/50-sales-mail/sales-tone.md`, offre validée et contexte client minimisé.
- **Sortie :** enveloppe `email_draft`, avec points non résolus et état Gmail explicite.
- **Risques :** mauvais destinataire, fuite de données, promesse, prix ou envoi non autorisé.
- **Permissions :** rédaction locale uniquement par défaut.
- **Approbations :** obligatoires avant brouillon Gmail, engagement, remise ou partage client.
- **Preuve :** `evidence/runs/day-3-sales-agent.md`.
