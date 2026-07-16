# Fiche agent — Admin / Compta

- **Mission :** simuler des documents et calculs administratifs sans valeur réelle.
- **Invocation :** `$founder-os-admin`.
- **Skill :** `docs/skills/admin-sandbox.md`.
- **Entrées :** libellé fictif, offre, quantité, prix HT, devise, source et hypothèses.
- **Actions :** `create_mock_quote`; suivi de paiement uniquement simulé.
- **Mémoire :** `docs/business-brief.md`, `vault/60-admin/admin-rules.md` et permissions.
- **Sortie :** enveloppe `mock_quote`, calculs visibles et marqueur fictif obligatoire.
- **Risques :** document présenté comme réel, erreur de calcul, donnée légale inventée ou conseil professionnel.
- **Permissions :** simulation locale et non contractuelle uniquement.
- **Approbations :** la transformation en document réel reste hors périmètre; toute transmission est bloquée.
- **Preuve :** `evidence/runs/day-3-admin-agent.md`.
