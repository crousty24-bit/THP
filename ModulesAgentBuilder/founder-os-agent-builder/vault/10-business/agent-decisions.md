---
type: decisions
status: validated
updated: 2026-07-15
sensitivity: internal
---

# Agent decisions

## Décisions actives

- Codex et la session ChatGPT existante fournissent le raisonnement des agents.
- Les connaissances durables restent dans des fichiers Markdown locaux et
  versionnés.
- Le Coach utilise une sélection manuelle de notes, sans embeddings ni base RAG
  cloud pour cette première version.
- Toute note utilisée dans une réponse doit être citée par son chemin relatif.
- Les agents peuvent proposer un brouillon, mais l'écriture permanente dans le
  vault exige une validation humaine.
- Aucun agent ne peut envoyer un message, prendre un engagement commercial ou
  exposer une note privée sans autorisation adaptée.

## Révision

Ces décisions pourront évoluer après une comparaison documentée entre la
recherche manuelle et une recherche sémantique.
