# Règles de routing Founder OS

## Principe de sélection

L'Orchestrateur choisit la route la plus étroite qui couvre le résultat demandé.
Il transmet seulement les faits, contraintes, inconnues et sorties validées utiles
à la mission suivante. Une sortie d'agent reste une proposition tant qu'une
décision humaine n'est pas explicitement enregistrée.

| Type de demande | Agent principal | Agents complémentaires | Entrées minimales | Action sensible et approval |
| --- | --- | --- | --- | --- |
| Qualification d'une demande entrante | Orchestrateur | Spécialistes recommandés seulement | Demande assainie, objectif, contraintes connues | Aucune pour la qualification locale ; approval avant toute suite sensible |
| Prospect demandant une offre ou un site web | SEO / Marché | Code / Produit, puis Mail / Sales | Secteur, cible, zone, objectif, offre et inconnues | Approval avant brouillon Gmail, engagement commercial ou publication ; envoi interdit |
| Cadrage d'un site ou produit | Code / Produit | SEO si acquisition organique, Sales si réponse attendue | Besoin qualifié, audience, contenus, contraintes | Approval avant fichier permanent, dépendance, changement de périmètre ou déploiement |
| Recherche SEO ou marché | SEO / Marché | Code / Produit si les résultats alimentent un livrable | Offre, cible, langue, zone, sources autorisées | Approval avant API payante, collecte massive ou donnée sensible |
| Campagne ou ciblage sortant | Prospection | Mail / Sales après segmentation | Offre, cible et origine autorisée des données | Approval avant import, enrichissement, export ou brouillon cloud ; contact réel interdit |
| Réponse, relance ou proposition commerciale | Mail / Sales | Produit pour le périmètre, Admin pour une simulation | Demande, offre validée, destinataire provisoire et inconnues | Approval avant brouillon Gmail, remise ou engagement ; envoi interdit |
| Devis ou suivi administratif simulé | Admin / Compta | Produit pour le périmètre, Sales pour le contexte | Offre, prix fictif, périmètre et identité fictive | Document réel interdit ; approval avant transmission de la simulation |
| Apprentissage ou rappel de décisions | Coach / Apprentissage | Aucun par défaut | Question et notes locales autorisées | Approval avant écriture permanente ou transmission cloud sensible |

## Route obligatoire — prospect pour une offre web

Utiliser `docs/workflows/prospect-web-offer.md` et appeler successivement :

1. **SEO / Marché** pour les intentions et angles qualitatifs ;
2. **Code / Produit** pour transformer le besoin et les éléments SEO utiles en
   périmètre vérifiable ;
3. **Mail / Sales** pour préparer une réponse locale au prospect.

L'Orchestrateur évalue ensuite la sortie Sales et autorise au maximum une
révision. Il ne remplace aucun spécialiste et n'ajoute aucun fait absent.

## Gestion des échecs

- **Contexte incomplet :** conserver les éléments absents dans `unknowns` ou
  `unresolved_points` et produire les étapes encore fiables.
- **Sortie invalide ou `error` :** ne pas la transmettre comme résultat ; arrêter
  ses dépendants, consigner l'erreur et demander une correction ciblée.
- **Approval absente ou refusée :** bloquer l'action sensible, noter la décision
  et continuer uniquement les travaux locaux indépendants.
- **Révision Sales encore non conforme :** arrêter la boucle après une révision,
  marquer le brouillon pour revue humaine et ne créer aucun brouillon cloud.
