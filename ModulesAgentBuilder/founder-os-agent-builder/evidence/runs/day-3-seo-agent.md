# Run — Day 3 SEO Agent

## Input

> À partir uniquement de ce brief fictif — artisan rénovation à Lyon, mini-site
> destiné aux particuliers — propose des intentions et mots-clés qualitatifs.

## Skill utilisé

- Agent : `$founder-os-seo`
- Workflow : `docs/skills/seo-research.md`
- Mode : simulation locale ; aucune SERP, API ou source web consultée

## Sortie

```json
{
  "schema_version": "1.0",
  "action": "extract_seo_keywords",
  "status": "success",
  "approval_required": false,
  "warnings": ["Analyse locale qualitative : volumes et SERP non vérifiés."],
  "data": {
    "research_scope": {"offer": "Mini-site artisan rénovation", "audience": "Particuliers", "location": "Lyon", "language": "fr"},
    "sources": [{"reference": "Brief fictif du run", "consulted_at": "2026-07-16", "type": "local"}],
    "keywords": [
      {"query": "artisan rénovation Lyon", "intent": "commercial-local", "theme": "prestataire", "priority": "high", "source": "Brief fictif du run"},
      {"query": "entreprise rénovation Lyon", "intent": "commercial-local", "theme": "prestataire", "priority": "high", "source": "Brief fictif du run"},
      {"query": "travaux rénovation appartement Lyon", "intent": "commercial", "theme": "projet", "priority": "medium", "source": "Brief fictif du run"}
    ],
    "content_angles": ["Prestations et zone d'intervention", "Réalisations de rénovation", "Étapes d'une demande de travaux"],
    "unknowns": ["Prestations exactes", "Zone autour de Lyon", "Volume", "Difficulté", "Concurrents actuels"],
    "limitations": ["Requêtes déduites du seul vocabulaire du brief", "Aucune validation de demande réelle"]
  }
}
```

## Respect du format

- Conforme : périmètre, source datée, mots-clés, angles, inconnues et limites.
- Conforme : chaque mot-clé possède intention, thème, priorité et source.
- Conforme : aucune métrique, position ou information concurrentielle inventée.

## Limites observées

La liste prouve le respect du workflow, pas l'existence d'une demande SEO. Une
recherche publique datée serait nécessaire pour étudier la SERP et les acteurs
actuels ; un outil fiable serait nécessaire pour toute métrique.
