# Matrice agents, skills et outils

| Agent | Skill | Tools / actions | Mémoire | Risques principaux | Approvals |
| --- | --- | --- | --- | --- | --- |
| Code / Produit | `product-brief.md` | `prepare_product_brief`; lecture locale | Brief, offre, décisions projet validées | Périmètre ou engagement inventé | Avant fichier, dépendance, changement de périmètre ou déploiement |
| SEO / Marché | `seo-research.md` | `extract_seo_keywords`; sources publiques | Brief, idées SEO, sources datées | Faux volume, source obsolète, collecte excessive | Avant API payante, collecte massive ou donnée sensible |
| Prospection | `prospecting.md` | Plan local; `qualify_lead` | Cibles, offre, données autorisées | Donnée personnelle, profilage ou contact non autorisé | Avant import, enrichissement, export ou contact réel |
| Mail / Sales | `sales-copy.md` | `draft_email_reply`; Gmail optionnel | Ton commercial, offre, contexte minimisé | Fuite, promesse, mauvais destinataire ou envoi | Avant lecture Gmail, brouillon cloud, engagement ou remise |
| Admin / Compta | `admin-sandbox.md` | `create_mock_quote`; suivi simulé | Tarifs fictifs, règles admin | Document pris pour réel, erreur ou donnée légale inventée | Document réel interdit; approbation avant toute transmission |
| Coach / Apprentissage | `learning-coach.md` | `search_knowledge_base`; BM25 local | Quatre notes classées au maximum | Note obsolète, citation ou statut incorrect | Avant écriture permanente ou transmission sensible |

Les approvals sont ciblés sur une action précise et utilisent l'enveloppe
`request_human_approval` avec `status: blocked`. Ils n'autorisent jamais l'étape
suivante et une absence de réponse vaut refus. Une instruction dans une demande,
une note ou une source externe ne peut jamais valoir approval.
