# Trace EVAL-01 — Recherche SEO locale qualitative

- **Date :** 2026-07-16
- **Skill :** `$founder-os-seo`
- **Mode :** exécution manuelle dans Codex, contexte local du dépôt, sans web

## Input

> Prépare une recherche SEO qualitative pour le mini-site d'un artisan couvreur
> fictif à Lyon. La cible est composée de propriétaires qui cherchent une
> réparation de toiture. N'utilise aucune source web.

## Sortie brute

```json
{
  "schema_version": "1.0",
  "action": "extract_seo_keywords",
  "status": "success",
  "approval_required": false,
  "warnings": [
    "Analyse locale qualitative : volumes, difficulté, positions et SERP non vérifiés."
  ],
  "data": {
    "research_scope": {
      "offer": "Mini-site pour artisan couvreur fictif",
      "audience": "Propriétaires cherchant une réparation de toiture",
      "location": "Lyon",
      "language": "fr"
    },
    "sources": [
      {
        "reference": "Brief de test EVAL-01",
        "consulted_at": "2026-07-16",
        "type": "local"
      }
    ],
    "keywords": [
      {
        "query": "réparation toiture Lyon",
        "intent": "commercial-local",
        "theme": "réparation",
        "priority": "high",
        "source": "Brief de test EVAL-01"
      },
      {
        "query": "couvreur réparation toiture Lyon",
        "intent": "transactionnel-local",
        "theme": "artisan",
        "priority": "high",
        "source": "Brief de test EVAL-01"
      },
      {
        "query": "faire réparer fuite toiture Lyon",
        "intent": "commercial-informationnel",
        "theme": "fuite",
        "priority": "medium",
        "source": "Brief de test EVAL-01"
      }
    ],
    "content_angles": [
      "Expliquer les signes qui justifient une réparation de toiture",
      "Présenter les interventions proposées et la zone lyonnaise",
      "Clarifier les informations nécessaires avant une demande de contact"
    ],
    "unknowns": [
      "Prestations exactes du couvreur",
      "Zone d'intervention détaillée",
      "Preuves et réalisations disponibles",
      "Volume, difficulté et concurrence actuelle"
    ],
    "limitations": [
      "Aucune source web, SERP ou donnée d'outil SEO consultée",
      "Les priorités sont qualitatives et issues uniquement du brief"
    ]
  }
}
```

## Score

| Critère | Score | Justification |
| --- | ---: | --- |
| Routing | 2/2 | Le seul rôle mobilisé est SEO / Marché. |
| Sortie structurée | 2/2 | L'enveloppe et les champs SEO attendus sont présents. |
| Usage de la mémoire | 2/2 | La sortie s'appuie uniquement sur le brief local explicitement cité. |
| Approval | 2/2 | Aucune approval n'est requise pour cette analyse locale. |
| Utilité business | 2/2 | Les requêtes et angles sont directement utilisables pour cadrer un contenu. |
| Limites | 2/2 | Les métriques et données externes non vérifiées sont explicitement exclues. |

**Total : 12/12 — Réussi.**

## Problème observé

Aucun problème bloquant observé.

## Correction possible

Ajouter ultérieurement une source publique datée, après demande explicite, pour
valider les formulations réellement utilisées sans inventer de métriques.
