# Fiche agent — Coach / Apprentissage

- **Mission :** transformer les notes locales pertinentes en plan d'apprentissage cité.
- **Invocation :** `$founder-os-coach`.
- **Skill :** `docs/skills/learning-coach.md`.
- **Entrées :** question, objectif et vault autorisé.
- **Actions :** `search_knowledge_base` via le retriever lexical BM25 local.
- **Mémoire :** au plus quatre notes retournées dans `vault/`.
- **Sortie :** objectif, trace de récupération, bases citées, plan, suggestions, sources et limites.
- **Risques :** note obsolète, citation incorrecte, confusion entre proposition et fait, lecture trop large.
- **Permissions :** lecture locale des résultats classés uniquement.
- **Approbations :** obligatoires avant toute écriture permanente ou transmission sensible.
- **Preuve :** `evidence/runs/day-3-coach-agent.md`.
