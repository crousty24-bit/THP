# Choix provisoire des fournisseurs

## Décision

Web Studio OS adopte provisoirement une architecture **cloud-first hybride** :

- **OpenAI** pour les tâches courantes nécessitant de bonnes capacités de
  génération, de synthèse ou de raisonnement ;
- **Obsidian et le dossier `vault/` en local** pour la mémoire durable ;
- **Ollama en local** comme solution de repli pour la confidentialité, les
  indisponibilités réseau ou la maîtrise des coûts.

Aucune intégration, clé API ou dépense n'est mise en place dans ce blueprint.

## Données et localisation

| Type de donnée | Traitement provisoire |
| --- | --- |
| Brief générique, offre et tarifs fictifs | Envoi cloud autorisé si aucun élément sensible n'est ajouté. |
| Contenu public et demandes anonymisées | Envoi cloud autorisé selon la tâche. |
| Notes Obsidian et décisions internes | Stockage local ; extraction minimale seulement si autorisée. |
| Prospects, emails et données personnelles réelles | Local par défaut ; anonymisation ou validation humaine avant tout envoi cloud. |
| Documents administratifs et financiers | Local par défaut ; aucun traitement cloud sans validation explicite. |
| Secrets et clés API | Local uniquement dans une configuration sécurisée et ignorée par Git. |
| Traces de runs | Locales, assainies et sans secret ni donnée personnelle inutile. |

## Coûts et limites

OpenAI implique un coût variable selon le modèle, le volume de tokens et les
outils utilisés. Chaque future action payante devra annoncer son coût estimé et
obtenir une validation humaine. Le service dépend également du réseau, des
conditions du fournisseur et de règles de conservation qu'il faudra vérifier
avant l'intégration réelle.

Ollama évite l'envoi cloud et les coûts par appel, mais consomme les ressources de
la machine et peut offrir une qualité, une vitesse ou une taille de contexte
différentes. Les réponses locales ne sont pas automatiquement plus fiables :
elles devront être évaluées et tracées comme les réponses cloud.

## Adéquation à la machine et au projet

La machine de développement dispose d'un processeur Intel Core i7-13700KF, de
32 Go de mémoire, d'une NVIDIA GeForce RTX 4070 Ti avec 12 Go de VRAM et
d'Ollama déjà installé. Elle peut donc exécuter des modèles locaux adaptés, tout
en utilisant OpenAI pour les tâches où la qualité ou la capacité prime.

Cette combinaison est cohérente avec une micro-agence : elle permet de démarrer
rapidement avec un fournisseur cloud, tout en conservant une voie locale pour
les informations sensibles. Le choix sera réévalué à partir des coûts, de la
qualité, de la latence et des preuves collectées lors des futurs runs.
