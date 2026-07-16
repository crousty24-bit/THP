# Run — Day 3 Founder OS Orchestration

## Demande initiale

> Un artisan fictif écrit depuis `prospect@example.test`. Il veut un site vitrine
> pour présenter ses prestations et recevoir davantage de demandes de devis. Son
> métier précis, sa zone, son budget, son délai, le nombre de pages et ses
> contenus disponibles ne sont pas connus. Préparer une réponse sans l'envoyer.

La demande est fictive et assainie. L'adresse `.test` ne désigne pas un prospect
réel.

## Routing

- **Route choisie :** prospect demandant une offre ou un site web.
- **Workflow :** `docs/workflows/prospect-web-offer.md`.
- **Ordre :** SEO / Marché → Code / Produit → Mail / Sales → Evaluator → Sales
  Optimizer → synthèse de l'Orchestrateur.
- **Motif :** la demande combine visibilité organique, cadrage produit et réponse
  commerciale locale.
- **Routes exclues :** Prospection, car le prospect est déjà entrant ; Admin,
  car aucun périmètre ne permet un devis fictif ; Coach, car aucune question
  d'apprentissage ou de mémoire n'est posée.

## Agents appelés

1. `$founder-os-seo` — préparer des intentions qualitatives sans inventer le
   métier, la zone ou des volumes.
2. `$founder-os-product` — cadrer le résultat attendu et conserver les inconnues.
3. `$founder-os-sales` — rédiger puis, après évaluation, réviser un brouillon
   local non envoyé.

L'Orchestrateur contrôle les enveloppes, effectue l'évaluation et synthétise. Les
spécialistes sont des rôles appliqués séquentiellement dans la même session
Codex, pas des processus isolés.

## Handoffs

### Handoff 1 — Orchestrateur vers SEO

- **Transmis :** artisan fictif, site vitrine, objectif de présenter les
  prestations et de recevoir plus de demandes de devis, langue française,
  source locale et inconnues métier/zone.
- **Exclu :** adresse `.test`, budget, données personnelles et toute hypothèse de
  volume ou de concurrent.

### Handoff 2 — SEO vers Produit

- **Transmis :** intentions informationnelle, commerciale et locale sous forme
  de modèles à compléter ; angles prestations, preuves et demande de devis ;
  absence de SERP et de volume.
- **Exclu :** enveloppe SEO complète, priorité chiffrée et toute présentation des
  modèles comme mots-clés validés.

### Handoff 3 — Produit vers Sales

- **Transmis :** résumé, audience provisoire, objectifs, périmètre fonctionnel
  minimal, inconnues, risques et catalogue fictif sans choix d'offre.
- **Exclu :** détails SEO inutiles au message, prix final, délai et nombre de
  pages non validés.

### Handoff 4 — Evaluator vers Sales Optimizer

- **Transmis :** un seul échec — remplacer les deux prochaines actions de la
  version initiale par une demande unique de réponse aux questions de cadrage.
- **Exclu :** nouveau fait, nouveau prix, promesse ou modification de périmètre.

## Sorties intermédiaires

### Sortie SEO / Marché

```json
{
  "schema_version": "1.0",
  "action": "extract_seo_keywords",
  "status": "needs_input",
  "approval_required": false,
  "warnings": [
    "Analyse locale qualitative : métier, zone, volumes et SERP non vérifiés."
  ],
  "data": {
    "research_scope": {
      "offer": "Site vitrine pour un artisan fictif",
      "audience": "Prospects recherchant ses prestations",
      "location": null,
      "language": "fr"
    },
    "sources": [
      {
        "reference": "Demande fictive fournie",
        "consulted_at": "2026-07-16",
        "type": "local"
      }
    ],
    "keywords": [
      {
        "query": "[métier] [prestation]",
        "intent": "commerciale",
        "theme": "prestations",
        "priority": "high",
        "source": "Demande fictive fournie"
      },
      {
        "query": "[métier] [zone]",
        "intent": "commerciale-locale",
        "theme": "zone d'intervention",
        "priority": "high",
        "source": "Demande fictive fournie"
      },
      {
        "query": "devis [prestation] [zone]",
        "intent": "transactionnelle-locale",
        "theme": "demande de devis",
        "priority": "high",
        "source": "Demande fictive fournie"
      }
    ],
    "content_angles": [
      "Expliquer les prestations et la zone d'intervention",
      "Présenter des preuves autorisées de réalisations",
      "Rendre la demande de devis visible et compréhensible"
    ],
    "unknowns": [
      "Métier et prestations exactes",
      "Zone d'intervention",
      "Vocabulaire utilisé par les clients",
      "Réalisations et droits sur les médias"
    ],
    "limitations": [
      "Modèles de requêtes à compléter, pas mots-clés validés",
      "Aucune recherche web, SERP, donnée de volume ou concurrence consultée"
    ]
  }
}
```

**Contrôle Orchestrateur :** enveloppe et action conformes. Le statut
`needs_input` n'empêche pas le cadrage Produit, car les limites et inconnues sont
explicites et aucun fait externe n'est affirmé.

### Sortie Code / Produit

```json
{
  "schema_version": "1.0",
  "action": "prepare_product_brief",
  "status": "needs_input",
  "approval_required": false,
  "warnings": [
    "Le format, le prix et le délai ne peuvent pas être validés avant cadrage."
  ],
  "data": {
    "summary": "Site vitrine d'un artisan fictif présentant ses prestations et facilitant les demandes de devis.",
    "audience": [
      "Prospects recherchant les prestations de l'artisan"
    ],
    "goals": [
      "Comprendre les prestations",
      "Identifier la zone d'intervention",
      "Demander un devis"
    ],
    "scope_in": [
      "Présentation de l'activité et des prestations",
      "Preuves ou réalisations si les droits sont confirmés",
      "Moyen visible de demander un devis"
    ],
    "scope_out": [
      "Vente ou paiement en ligne",
      "Espace client",
      "Choix définitif entre landing page et mini-site",
      "Développement et publication"
    ],
    "deliverables": [
      "Arborescence proposée après cadrage",
      "Brief de contenus",
      "Checklist de recette"
    ],
    "acceptance_criteria": [
      "Un visiteur peut identifier les prestations présentées",
      "La zone d'intervention validée est visible",
      "Une demande de devis peut être initiée depuis une action clairement identifiée"
    ],
    "unknowns": [
      "Métier et prestations exactes",
      "Zone d'intervention",
      "Budget",
      "Échéance",
      "Nombre de pages",
      "Contenus disponibles",
      "Mode de contact souhaité"
    ],
    "risks": [
      "Choisir une offre ou un prix avant de connaître le périmètre",
      "Utiliser des réalisations sans droits confirmés",
      "Présenter les modèles SEO comme des requêtes validées"
    ],
    "next_action": "Faire répondre le prospect aux sept questions de cadrage avant de choisir l'offre."
  }
}
```

**Contrôle Orchestrateur :** enveloppe conforme, recommandations SEO maintenues
au statut d'hypothèses et aucune offre, page, date ou somme inventée.

### Sortie Mail / Sales — version 1

```json
{
  "schema_version": "1.0",
  "action": "draft_email_reply",
  "status": "needs_input",
  "approval_required": false,
  "warnings": [
    "Brouillon local uniquement : aucun mail n'a été créé ni envoyé."
  ],
  "data": {
    "to": [
      "prospect@example.test"
    ],
    "cc": [],
    "subject": "Re: Votre projet de site vitrine",
    "body": "Bonjour,\n\nMerci pour votre demande. Nous pouvons préparer un site vitrine pour présenter votre activité et faciliter les demandes de devis. Afin de cadrer une solution adaptée, pourriez-vous nous préciser votre métier, vos prestations, votre zone d'intervention, les contenus dont vous disposez, votre budget et votre échéance ? Vous pouvez répondre à ces questions par retour de mail ou nous proposer un créneau d'échange. Aucun tarif ni délai ne peut être confirmé avant ce cadrage.\n\nBien cordialement,\nWeb Studio OS",
    "unresolved_points": [
      "Métier et prestations",
      "Zone d'intervention",
      "Contenus disponibles",
      "Budget",
      "Échéance",
      "Format du site et prix"
    ],
    "source_message_id": null,
    "gmail_draft_created": false
  }
}
```

**Contrôle Orchestrateur :** enveloppe conforme et sans promesse, mais le corps
propose deux prochaines actions : répondre aux questions ou proposer un créneau.
La version doit passer par l'optimizer.

## Évaluation et optimisation

### Évaluation de la version 1

| Critère | Résultat | Motif |
| --- | --- | --- |
| Fidélité | pass | Le site vitrine, les prestations et la demande de devis sont conservés. |
| Promesses | pass | Aucun résultat, délai ou disponibilité n'est garanti. |
| Prix | pass | Aucun prix n'est inventé et l'absence de confirmation est explicite. |
| Inconnues | pass | Les informations principales manquantes sont demandées et listées. |
| Appel à l'action | fail | Le message propose une réponse écrite ou un créneau d'échange. |
| Statut | pass | Le résultat est local, non envoyé et `gmail_draft_created` vaut `false`. |

**Score : 5/6. Décision :** une révision Sales ciblée est autorisée.

### Sortie Mail / Sales — version optimisée

```json
{
  "schema_version": "1.0",
  "action": "draft_email_reply",
  "status": "needs_input",
  "approval_required": false,
  "warnings": [
    "Brouillon local uniquement : aucun mail n'a été créé ni envoyé."
  ],
  "data": {
    "to": [
      "prospect@example.test"
    ],
    "cc": [],
    "subject": "Re: Votre projet de site vitrine",
    "body": "Bonjour,\n\nMerci pour votre demande. Nous pouvons préparer un site vitrine pour présenter votre activité et faciliter les demandes de devis. Afin de cadrer une solution adaptée, pourriez-vous répondre à ce message en précisant votre métier, vos prestations, votre zone d'intervention, les contenus dont vous disposez, votre budget et votre échéance ? Aucun tarif ni délai ne peut être confirmé avant ce cadrage.\n\nBien cordialement,\nWeb Studio OS",
    "unresolved_points": [
      "Métier et prestations",
      "Zone d'intervention",
      "Contenus disponibles",
      "Budget",
      "Échéance",
      "Format du site et prix"
    ],
    "source_message_id": null,
    "gmail_draft_created": false
  }
}
```

### Réévaluation

| Critère | Résultat |
| --- | --- |
| Fidélité | pass |
| Promesses | pass |
| Prix | pass |
| Inconnues | pass |
| Appel à l'action | pass |
| Statut | pass |

**Score : 6/6. Décision :** conserver la version optimisée. La boucle s'arrête
après une révision.

## Approvals

| Étape | Approval requise | Décision dans ce run |
| --- | --- | --- |
| Analyse SEO locale | Non | Exécutée |
| Brief Produit local | Non | Exécuté |
| Brouillon Sales local | Non | Exécuté et optimisé |
| Accès ou lecture Gmail | Oui, ciblée | Non demandée ; action non exécutée |
| Création d'un brouillon Gmail | Oui sur destinataire, objet et contenu exact | Non demandée ; action non exécutée |
| Envoi d'un message réel | Interdit | Non exécuté |
| Engagement sur prix, délai ou résultat | Oui après cadrage ; engagement absent du run | Non exécuté |
| Développement ou publication | Oui sur livrable et destination | Hors périmètre ; non exécuté |

Aucune absence de réponse n'a été interprétée comme une approval.

## Synthèse finale

Le prospect fictif cherche une présence web centrée sur la compréhension de ses
prestations et la demande de devis. La demande correspond potentiellement à une
landing page ou un mini-site, mais les informations disponibles ne permettent
pas de choisir l'offre ni d'annoncer un prix ou un délai. L'analyse SEO fournit
uniquement des modèles qualitatifs à compléter après confirmation du métier et
de la zone. Le cadrage Produit définit les résultats attendus et exclut la
production. Le brouillon Sales optimisé demande en une seule action les données
nécessaires au cadrage et reste local, non envoyé.

## Prochaines actions

1. Faire relire et valider humainement le contenu exact du brouillon si une
   création dans Gmail est envisagée.
2. Recueillir métier, prestations, zone, contenus, budget et échéance avant de
   choisir entre landing page et mini-site.
3. Relancer une orchestration avec ces réponses pour préciser SEO, périmètre et
   proposition commerciale.

## Limites

- Il s'agit d'une simulation dans une seule session Codex, pas d'agents isolés
  ni d'une exécution parallèle.
- Aucune recherche web, SERP, donnée de volume ou concurrence n'a été vérifiée.
- Le métier, la zone, le budget, le délai et les contenus restent inconnus.
- La conformité 6/6 vérifie la grille documentée, pas l'efficacité commerciale
  réelle du message.
- Aucun accès Gmail, envoi, devis réel, développement ou déploiement n'a eu lieu.
