# Skill — SEO research

## Quand l'utiliser

Utiliser ce skill pour explorer des intentions de recherche, thèmes et mots-clés
à partir d'un brief ou de sources publiques identifiables. Ne pas l'utiliser
pour promettre un classement ou inventer des données de marché.

## Entrées attendues

- offre, cible, langue et zone géographique ;
- objectif SEO et contenu source autorisé ;
- sources locales ou publiques, avec date de consultation pour le web ;
- contraintes d'outil ou de budget.

## Sortie attendue

Produire l'enveloppe commune avec `action: extract_seo_keywords`. `data` contient
`research_scope`, `sources`, `keywords`, `content_angles`, `unknowns` et
`limitations`. Chaque mot-clé indique `query`, `intent`, `theme`, `priority` et
`source`. La priorité reste qualitative.

## Méthode

1. Définir cible, zone, langue et objectif.
2. Extraire le vocabulaire attesté dans les sources autorisées.
3. Regrouper les requêtes par thème et intention.
4. Prioriser qualitativement selon pertinence métier et proximité de conversion.
5. Relier les angles de contenu aux intentions retenues.
6. Citer les sources et expliciter les données absentes.

## Garde-fous

- Ne jamais inventer volume, difficulté, position ou concurrent.
- Dater et citer toute source publique ; signaler une analyse uniquement locale.
- Demander validation avant API payante, collecte massive ou donnée sensible.
- Ne pas collecter de donnée personnelle ni présenter une hypothèse comme fait.

## Exemple

Avec le brief local « artisan rénovation à Lyon », proposer qualitativement
« artisan rénovation Lyon » comme intention commerciale locale, en citant le
brief fourni et en indiquant que volume et SERP actuelle n'ont pas été vérifiés.
