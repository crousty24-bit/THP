# Choix du fournisseur cloud

## Décision

Founder OS Qualifier utilise exclusivement l'API cloud OpenAI. Le modèle est
figé à `gpt-5-mini-2025-08-07` et appelé via l'API Responses. Aucun modèle d'IA
local, serveur d'inférence local ou fournisseur de repli n'est prévu pour ce
livrable.

Le runner Node.js reste local, mais il ne réalise aucune inférence : il construit
la requête, l'envoie à OpenAI, valide la réponse et calcule le coût.

## Pourquoi OpenAI

- le modèle prend en charge les Structured Outputs nécessaires au contrat JSON ;
- l'API Responses accepte `store: false` ;
- le prix de GPT-5 mini est adapté à une qualification textuelle courte ;
- un script API versionné est plus reproductible qu'une configuration manuelle
  dans une interface web.

Références consultées le 14 juillet 2026 :

- [GPT-5 mini — modèle et tarifs](https://developers.openai.com/api/docs/models/gpt-5-mini) ;
- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) ;
- [contrôles des données API](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint).

## Données envoyées

Chaque run transmet uniquement :

- les instructions versionnées de l'agent ;
- le contexte métier minimal : offres et prix fictifs, rôles disponibles et
  règles de validation ;
- la demande entrante à qualifier.

Le run obligatoire utilise une demande générique sans nom, email, adresse,
secret, document client ou autre donnée personnelle. Le vault, les fichiers du
repo et l'historique des autres runs ne sont pas envoyés.

## Conservation et confidentialité

La requête fixe `store: false`. D'après la documentation OpenAI, les données de
l'API ne servent pas à entraîner les modèles sauf opt-in explicite. Des journaux
de surveillance des abus peuvent cependant contenir prompts et réponses et sont
conservés jusqu'à 30 jours par défaut. Les contrôles Zero Data Retention exigent
une éligibilité et une approbation distinctes ; ils ne sont pas supposés actifs
ici.

Une demande réelle doit être minimisée et anonymisée avant envoi. Toute donnée
sensible exige une validation humaine explicite conformément à la politique du
projet. La clé API reste dans `.env.local`, ignoré par Git.

## Coût potentiel

Au 14 juillet 2026, GPT-5 mini coûte 0,25 $ par million de tokens d'entrée,
0,025 $ par million de tokens d'entrée mis en cache et 2 $ par million de tokens
de sortie. Le runner calcule le coût de chaque run depuis les compteurs retournés
par l'API :

```text
coût = entrée non cachée × 0,25 $ / 1M
      + entrée cachée × 0,025 $ / 1M
      + sortie × 2 $ / 1M
```

Le plafond technique de sortie est fixé à 1 200 tokens. Le run obligatoire est
autorisé avec un coût attendu inférieur à 0,01 $. Les prix du fournisseur
peuvent évoluer : ils doivent être revérifiés avant une estimation future.

## Limites du choix

- dépendance au réseau, à la disponibilité de l'API, au crédit du compte et aux
  limites de débit ;
- coût variable selon le nombre de tokens ;
- traitement de données par un tiers cloud ;
- sortie probabiliste malgré le schéma strict ;
- revue humaine toujours nécessaire avant un engagement commercial.
