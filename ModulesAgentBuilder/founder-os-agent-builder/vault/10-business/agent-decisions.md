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
- Le Coach utilise un RAG lexical automatisé et local : un moteur BM25 Python
  classe au plus quatre notes avant leur lecture, sans embeddings ni base cloud.
- Toute note utilisée dans une réponse doit être citée par son chemin relatif.
- Les agents peuvent proposer un brouillon, mais l'écriture permanente dans le
  vault exige une validation humaine.
- Aucun agent ne peut envoyer un message, prendre un engagement commercial ou
  exposer une note privée sans autorisation adaptée.

## Révision

Une recherche sémantique ne sera envisagée que si des tests montrent que le
classement lexical manque régulièrement des notes pertinentes.
