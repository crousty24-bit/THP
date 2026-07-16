# Configuration de l'orchestration Founder OS

## Outil et mode d'hébergement

L'orchestration utilise Codex avec la session OpenAI/ChatGPT existante et la skill
repo-scoped `.agents/skills/founder-os-qualifier/SKILL.md`. La configuration, les
briefs, les règles, la mémoire et les preuves sont des fichiers locaux. Les
extraits effectivement chargés sont traités par Codex/OpenAI : la stack est donc
hybride, et non entièrement locale.

Aucune clé API, dépendance, instance n8n ou Flowise et aucun modèle local ne sont
ajoutés. Le coût marginal exact d'un run n'est pas exposé par la session : **je ne
sais pas** le chiffrer.

## Ce qui est automatisé dans une session

- qualification de la demande et sélection d'une route documentée ;
- création du contexte commun et des handoffs minimisés ;
- application séquentielle des workflows SEO, Produit et Sales ;
- contrôle des enveloppes structurées et des approvals ;
- évaluation de la sortie Sales et demande d'une révision maximum ;
- synthèse finale et trace assainie lorsque l'utilisateur la demande.

Le raisonnement reste probabiliste. Les contrôles documentaires réduisent les
écarts mais ne constituent pas un moteur de workflow déterministe.

## Ce qui reste simulé

- les agents spécialistes sont des rôles et skills appliqués dans la même session
  Codex, pas des processus ou modèles isolés exécutés en parallèle ;
- le prospect, son adresse `.test`, la recherche SEO et les sorties commerciales
  de la preuve sont fictifs ou locaux ;
- aucune SERP, API payante, boîte Gmail, donnée réelle, publication ou livraison
  n'est utilisée ;
- aucune approval n'est déduite : une action sensible attend une décision humaine
  explicite et ciblée.

## Prochaine amélioration

Ajouter un runner local qui valide automatiquement les enveloppes JSON, journalise
les transitions et bloque techniquement les étapes dépendantes. Une intégration
cloud éventuelle devra ensuite isoler les agents, mesurer coût et latence, et
conserver les mêmes règles de minimisation et d'approval avant tout connecteur.
