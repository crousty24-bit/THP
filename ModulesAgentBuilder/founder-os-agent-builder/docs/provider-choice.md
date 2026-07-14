# Choix de plateforme

## Décision

Founder OS Qualifier adopte une approche hybride simple :

- **Codex** exécute le raisonnement de l'agent depuis la session ChatGPT déjà
  authentifiée ;
- **le dépôt local** conserve la configuration de l'agent, le contexte métier,
  les preuves, les exports et la future mémoire ;
- **aucune clé API**, aucun SDK, aucun appel facturé par token et aucun modèle
  d'IA local ne sont ajoutés au projet.

L'agent est une skill Codex versionnée dans
`.agents/skills/founder-os-qualifier`. La documentation officielle indique que
les skills sont disponibles dans l'application desktop, le CLI et l'extension
IDE, et qu'elles peuvent être invoquées explicitement avec `$nom-de-skill`.

Références consultées le 14 juillet 2026 :

- [Build skills](https://learn.chatgpt.com/docs/build-skills) ;
- [Authentication](https://learn.chatgpt.com/docs/auth) ;
- [Pricing](https://learn.chatgpt.com/docs/pricing).

## Données envoyées et données locales

Pendant un run, Codex traite dans son contexte :

- la demande saisie par l'utilisateur ;
- les instructions de la skill ;
- les extraits nécessaires du brief métier, des rôles et de la politique de
  permissions lus depuis le dépôt.

Le run obligatoire ne contient aucune identité, adresse, coordonnée, pièce
jointe, donnée sensible ou secret. Les documents complets non lus, le vault et
les autres dossiers ne sont pas ajoutés volontairement au contexte.

Les fichiers restent stockés localement, mais les contenus effectivement lus et
placés dans le contexte sont traités par Codex/OpenAI. Avec une connexion
ChatGPT, les permissions et règles de conservation dépendent du plan et des
réglages du workspace ChatGPT. Il ne faut donc pas envoyer de donnée sensible
sans minimisation et validation humaine.

## Coût

Ce projet ne crée aucune dépense API dédiée et ne calcule aucun coût par token.
Le run utilise les droits et limites de la session Codex/ChatGPT existante. La
documentation indique que ChatGPT et Codex partagent les crédits et limites
d'usage du plan.

Le coût marginal exact de ce run n'est pas exposé par Codex : **je ne sais pas**
le chiffrer. Le coût potentiel correspond à l'abonnement ou aux crédits du compte
ChatGPT déjà utilisé, dont le niveau n'est pas enregistré dans le repo.

## Limites

- dépendance à Codex, au réseau, à la session ChatGPT et à ses limites d'usage ;
- résultat probabiliste malgré des instructions structurées ;
- absence de compteur de tokens ou de coût par run dans cette preuve ;
- risque d'exposer un contenu si un fichier sensible est lu dans le contexte ;
- skill repo-scoped : elle doit être invoquée depuis ce projet ou explicitement ;
- validation humaine toujours obligatoire avant un engagement commercial.
