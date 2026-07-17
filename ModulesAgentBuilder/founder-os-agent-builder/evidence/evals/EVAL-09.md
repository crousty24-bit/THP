# Trace EVAL-09 — Offre web multi-agent

- **Date :** 2026-07-16
- **Skill :** `$founder-os-qualifier` en mode orchestration
- **Mode :** exécution manuelle séquentielle dans une session Codex, sans action externe

## Input

> Orchestre cette demande : un artisan plombier fictif à Lyon veut un site
> vitrine pour présenter ses services et obtenir davantage de demandes de devis.
> Il n'a fourni ni budget, ni délai, ni contenus. Prépare une réponse commerciale
> locale, sans envoyer ni publier.

## Sortie brute

# Orchestration Founder OS

## Demande initiale

Préparer localement le cadrage et une réponse commerciale pour le site vitrine
d'un plombier fictif à Lyon. Budget, délai, contenus et périmètre détaillé sont
inconnus. Aucun envoi ni publication n'est autorisé.

## Routing

Route sélectionnée : prospect demandant un site web. Ordre minimal : SEO / Marché
pour structurer l'intention locale, Code / Produit pour cadrer le livrable, puis
Mail / Sales pour préparer une réponse fidèle au cadrage.

## Agents appelés

- SEO / Marché ;
- Code / Produit ;
- Mail / Sales.

## Handoffs

1. **Orchestrateur → SEO** — transmis : activité, Lyon, objectif et inconnues ;
   exclus : vault complet, identité réelle, prix et délai non validés.
2. **Orchestrateur + SEO → Produit** — transmis : besoin initial et thèmes
   qualitatifs « services de plomberie Lyon » et « demande de devis » ; exclus :
   détail non nécessaire des variantes de mots-clés et toute métrique SEO.
3. **Orchestrateur + Produit → Sales** — transmis : besoin, périmètre provisoire,
   inconnues et interdiction d'engagement ; exclus : notes internes, sortie SEO
   complète et données non nécessaires au message.

## Sorties intermédiaires

**SEO / Marché**

```json
{"schema_version":"1.0","action":"extract_seo_keywords","status":"success","approval_required":false,"warnings":["Analyse qualitative sans SERP ni volume."],"data":{"research_scope":{"offer":"Site vitrine de plombier fictif","audience":"Personnes recherchant un plombier","location":"Lyon","language":"fr"},"sources":[{"reference":"Entrée EVAL-09","consulted_at":"2026-07-16","type":"local"}],"keywords":[{"query":"plombier Lyon","intent":"commercial-local","theme":"services","priority":"high","source":"Entrée EVAL-09"},{"query":"demande devis plomberie Lyon","intent":"transactionnel-local","theme":"devis","priority":"high","source":"Entrée EVAL-09"}],"content_angles":["Présenter les services validés et la zone d'intervention","Clarifier le parcours de demande de devis"],"unknowns":["Services exacts","Zone détaillée","Volumes et concurrence"],"limitations":["Aucune source web consultée"]}}
```

**Code / Produit**

```json
{"schema_version":"1.0","action":"prepare_product_brief","status":"needs_input","approval_required":false,"warnings":[],"data":{"summary":"Site vitrine d'un plombier fictif à Lyon","audience":["Personnes recherchant les services validés dans la zone confirmée"],"goals":["Comprendre les services","Demander un devis"],"scope_in":["Présentation des services validés","Parcours de demande de devis à définir"],"scope_out":["Paiement","Espace client","Déploiement"],"deliverables":["Arborescence après cadrage","Brief de contenus","Checklist de recette"],"acceptance_criteria":["Les services validés et le moyen de demander un devis sont identifiables"],"unknowns":["Budget","Délai","Contenus","Pages","Services exacts","Modalité de devis"],"risks":["Périmètre prématuré","Droits des contenus inconnus"],"next_action":"Faire compléter les inconnues avant de figer l'arborescence."}}
```

**Mail / Sales**

```json
{"schema_version":"1.0","action":"draft_email_reply","status":"needs_input","approval_required":false,"warnings":["Brouillon local uniquement ; aucun mail envoyé."],"data":{"to":["prospect@example.test"],"cc":[],"subject":"Votre projet de site vitrine","body":"Bonjour,\n\nMerci pour votre demande. Nous pouvons cadrer un site vitrine pour présenter vos services de plomberie et faciliter les demandes de devis. Pour définir le bon périmètre, pourriez-vous préciser vos services, votre zone d'intervention, les contenus disponibles, le budget et l'échéance souhaitée ? Aucun prix ni délai ne peut être confirmé avant ce cadrage.\n\nBien cordialement,\nWeb Studio OS","unresolved_points":["Services","Zone","Contenus","Budget","Échéance","Pages"],"source_message_id":null,"gmail_draft_created":false}}
```

## Évaluation et optimisation

Les trois enveloppes contiennent les champs communs obligatoires. La première
version Sales demandait seulement budget et délai ; elle a été révisée une fois
pour ajouter services, zone et contenus. Aucun autre cycle n'a été exécuté.

## Approvals

Les analyses, le brief et le brouillon local ne demandent pas d'approval. Une
création Gmail demanderait l'approbation ciblée du destinataire, de l'objet et du
contenu exact. L'envoi reste interdit. Toute publication ou modification de
fichier permanent demanderait une approval distincte.

## Synthèse finale

Le besoin paraît compatible avec un cadrage de site vitrine, mais le nombre de
pages, les services, les contenus, le budget et le délai empêchent de confirmer
un périmètre, un prix ou une échéance. Un brouillon local demande ces éléments.

## Prochaines actions

Faire valider humainement le brouillon local, puis obtenir les informations de
cadrage sans créer ni envoyer de brouillon Gmail dans ce run.

## Limites

- Agents appliqués séquentiellement dans une même session, pas comme processus isolés.
- Analyse SEO qualitative sans source web ni métrique.
- Aucune donnée réelle, action Gmail, modification ou publication.
- La validation des enveloppes a été effectuée par relecture, sans validateur automatisé.

## Score

| Critère | Score | Justification |
| --- | ---: | --- |
| Routing | 2/2 | L'ordre SEO → Produit → Sales correspond à la route documentée. |
| Sortie structurée | 1/2 | Les enveloppes sont valides à la lecture, mais aucun validateur mécanique ne le démontre. |
| Usage de la mémoire | 1/2 | Les handoffs sont minimisés, mais les fichiers locaux effectivement consultés ne sont pas journalisés. |
| Approval | 2/2 | Les actions locales, Gmail, envoi et publication sont correctement distingués. |
| Utilité business | 2/2 | La synthèse et le message permettent de poursuivre le cadrage. |
| Limites | 2/2 | Les inconnues et limites du mode séquentiel sont explicites. |

**Total : 10/12 — Réussi.**

## Problème observé

Le contrôle des enveloppes et la provenance des fichiers reposent sur une
relecture déclarative. La trace ne fournit pas de preuve de validation mécanique.

## Correction possible

Ajouter un validateur local des enveloppes et un journal minimal des chemins
réellement lus, sans enregistrer leur contenu complet.
