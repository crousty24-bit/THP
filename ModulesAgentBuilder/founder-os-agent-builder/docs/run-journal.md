# Journal de bord — Jour 1

- **Date :** 14 juillet 2026
- **Étape :** Founder OS Blueprint

## Pourquoi ce projet ?

J'ai choisi Web Studio OS, le cas proposé par la formation, parce qu'une
micro-agence web réunit plusieurs familles de travail complémentaires :
acquisition, vente, produit, SEO, administration et apprentissage. Le projet
offre donc un cadre concret pour apprendre à orchestrer plusieurs agents sans
leur donner des pouvoirs excessifs.

## Agents prioritaires

1. **Orchestrateur** : il garantit le bon routage, la minimisation du contexte et
   le respect des validations.
2. **Mail / Sales** : il aide à répondre rapidement sans envoyer ni promettre
   quoi que ce soit sans accord humain.
3. **Code / Produit** : il transforme la demande commerciale en périmètre et en
   livrables vérifiables.
4. **Admin / Compta** : il rend les prix et documents cohérents tout en restant
   dans un environnement fictif.

Les agents SEO, Prospection et Coach complètent ce noyau avec la compréhension
du marché, l'acquisition et la capitalisation des apprentissages.

## Actions sensibles identifiées

- envoyer un message réel ou engager commercialement l'agence ;
- importer, enrichir ou transmettre des données de prospects ;
- utiliser une API payante ou envoyer une donnée sensible dans le cloud ;
- modifier un fichier projet ou une note permanente du vault ;
- transformer un devis fictif en document réel ;
- déployer un livrable ou effectuer une opération administrative officielle.

Les paiements, déclarations réelles, contournements de validation et expositions
de secrets resteront interdits.

## Questions pour demain

- Quel format commun utiliser pour les entrées et sorties des agents ?
- Comment enregistrer un run, ses sources, ses coûts et ses validations ?
- Quel premier workflow permet de tester plusieurs agents sans action réelle ?
- Comment mesurer la qualité de deux versions de la skill exécutées dans Codex ?
- Quelles notes initiales créer dans Obsidian et selon quelles règles de mise à
  jour ?

## Mise à jour — premier agent

Founder OS Qualifier est maintenant configuré comme une skill Codex locale au
repo. Le test obligatoire a été exécuté directement dans Codex, sans clé API ni
modèle d'IA local, puis enregistré comme preuve assainie. Les agents spécialistes
restent des recommandations : aucun outil externe ni engagement commercial n'a
été exécuté.

## Mise à jour — Jour 2, bonus RAG lexical

- **Date :** 15 juillet 2026
- **Objectif :** automatiser la récupération des notes sans recherche sémantique.
- **Intervention :** ajout d'un moteur BM25 lexical en Python standard, appelé
  obligatoirement par Founder OS Coach avant la lecture des notes.
- **Trace :** le moteur retourne le nombre de documents analysés, le classement,
  les scores, les statuts, les termes trouvés et un extrait par note.
- **Résultat du scénario obligatoire :** 10 notes analysées ; `business-brief`,
  `learning-plan`, `offer` et `target-clients` classées dans les quatre premiers
  résultats.
- **Vérification :** cinq tests unitaires et d'intégration réussis, skill valide,
  chemins cités existants et copie Obsidian contrôlée.
- **Données :** récupération entièrement locale ; seules les quatre notes
  retenues sont ensuite traitées par la session Codex/OpenAI pour la génération.
- **Limite assumée :** pas d'embeddings ni de compréhension sémantique ; les
  synonymes sans racine commune peuvent être manqués.

## Mise à jour — Jour 3, skills et agents métier

- **Date :** 16 juillet 2026
- **Objectif :** rendre les six métiers du Founder OS directement invocables et
  leur donner des workflows réutilisables, testables et gouvernés.
- **Configuration :** cinq nouvelles skills Codex pour Produit, SEO,
  Prospection, Sales et Admin ; le Coach existant utilise désormais le même
  contrat documentaire.
- **Documentation :** six skills métier, six fiches agents et une matrice reliant
  actions, mémoire, risques et approvals.
- **Interfaces :** ajout de `prepare_product_brief` et du format structuré de
  `extract_seo_keywords` ; conservation des actions existantes.
- **Preuves :** six simulations assainies couvrent toutes les spécialités, sans
  envoi, collecte externe, paiement, déploiement ni écriture permanente.
- **Limites :** la recherche SEO de preuve est locale et qualitative ; les
  personas de prospection sont fictifs ; les autres sorties restent des
  brouillons ou simulations.
