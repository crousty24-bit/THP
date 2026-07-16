---
type: journal
status: logged
updated: 2026-07-15
sensitivity: internal
---

# Daily journal

## 2026-07-15 — Mémoire et Coach

- Le vault Founder OS est structuré par domaines métier.
- Dix notes initiales couvrent le brief, l'offre, les clients, le SEO, la vente,
  l'administration, l'apprentissage, les décisions, les permissions et le
  journal.
- La recherche manuelle locale a été retenue pour la première version du Coach.
- La copie versionnée du dépôt reste la source de vérité ; le vault Obsidian en
  reçoit une copie contrôlée.
- Aucun embedding, document store ou abonnement cloud supplémentaire n'est
  utilisé.

## Prochaine observation

Vérifier si le Coach retrouve les notes pertinentes, cite chaque recommandation
et signale correctement les hypothèses non validées.

## 2026-07-15 — Bonus RAG lexical automatisé

- Un moteur BM25 local classe désormais les notes avant chaque réponse du Coach.
- Le moteur utilise uniquement Python standard, sans index persistant,
  embeddings ou recherche sémantique.
- La question obligatoire retrouve quatre notes pertinentes avec une trace JSON
  reproductible.
- Cinq tests couvrent le moteur et le scénario réel du vault.
- La récupération reste locale ; Codex/OpenAI traite ensuite seulement les notes
  sélectionnées pour générer la réponse.
