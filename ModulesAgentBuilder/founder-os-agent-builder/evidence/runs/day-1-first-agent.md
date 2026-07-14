# Run — Day 1 First Agent

## Statut

**Run cloud tenté mais non abouti.** OpenAI a refusé la requête avant toute
génération pour quota API dépassé. Aucune qualification n'a été obtenue et
aucune sortie de substitution n'a été fabriquée.

- date de la tentative : 14 juillet 2026 à 17:42 CEST ;
- fournisseur : OpenAI API ;
- endpoint : `POST /v1/responses` ;
- modèle demandé : `gpt-5-mini-2025-08-07` ;
- persistance demandée : `store: false` ;
- identifiant de réponse : aucun, la requête a été rejetée avec HTTP 429.

## Demande testée

> Un artisan me demande un site vitrine pour vendre ses prestations de
> renovation. Il veut savoir le prix, le delai et ce qu'il doit fournir.

## Sortie obtenue

Le fournisseur n'a retourné aucune sortie d'agent. Le message d'erreur assaini
du runner est :

```text
OpenAI API error 429: You exceeded your current quota, please check your plan
and billing details.
```

Cette erreur correspond à l'état du compte ou du projet OpenAI, pas à une
qualification du besoin. Il serait faux de présenter un JSON rédigé localement
comme résultat de ce run.

## Analyse qualité

La qualité fonctionnelle de la réponse cloud n'est pas évaluable, puisqu'aucune
réponse n'a été générée. Les éléments suivants sont néanmoins vérifiés
localement par six tests automatisés :

- la requête utilise le modèle figé, `store: false` et un JSON Schema strict ;
- tous les champs demandés sont obligatoires ;
- les rôles sont limités aux agents Founder OS documentés ;
- exactement un risque principal est exigé ;
- une réponse fournisseur incomplète ou mal formée est rejetée ;
- l'absence de clé provoque une erreur explicite sans appel réseau.

Les critères métier du test obligatoire — agents sélectionnés, risque principal,
validation humaine et prochaine action — restent donc **non vérifiés en cloud**.

## Analyse coût

OpenAI n'a fourni aucun objet `usage` et aucun token n'a été généré. Le coût
calculable de cette tentative est donc de **0 $ à partir des données reçues**.
Le tableau de bord fournisseur reste la source finale pour confirmer l'absence
de facturation d'une requête rejetée.

Pour un run accepté, le runner calcule automatiquement le coût depuis
`input_tokens`, `input_tokens_details.cached_tokens` et `output_tokens`, avec
les tarifs documentés dans `docs/provider-choice.md`.

## Données exposées

La requête refusée contenait :

- les instructions versionnées de Founder OS Qualifier ;
- les tarifs fictifs et les six rôles de Web Studio OS ;
- les règles de validation humaine utiles ;
- la demande générique reproduite ci-dessus.

Elle ne contenait aucun nom, email, adresse, document, contenu du vault, secret
ou donnée personnelle réelle. La clé API a été envoyée dans l'en-tête
d'autorisation TLS, mais n'a été ni affichée, ni copiée dans cette trace, ni
commitée.

## Prochaine amélioration

Activer du crédit ou une facturation sur le projet OpenAI sélectionné, puis
relancer exactement la même commande une seule fois. Après un run réussi,
remplacer cette preuve d'échec par la sortie JSON exacte, l'identifiant de
réponse, l'usage en tokens, le coût calculé et une analyse métier des cinq champs
obligatoires.
