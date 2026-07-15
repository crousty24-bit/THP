# Configuration de la mémoire Founder OS

## Stack retenue

La mémoire est un vault Markdown local utilisé avec Obsidian et lu manuellement
par une skill Codex. Aucun embedding, index vectoriel, document store ou service
RAG supplémentaire n'est utilisé.

- **Source de vérité versionnée :** `vault/` dans le dépôt.
- **Vault Obsidian :**
  `C:\Users\allen\dossierlinux\Obsidian\founder-os-second-brain`.
- **Identifiant Obsidian :** `6b8145eaae75b31f`.
- **Agent lecteur :** `.agents/skills/founder-os-coach/`.

Les dossiers métier du dépôt sont copiés à l'identique à la racine du vault
Obsidian. Les fichiers `.obsidian/` et `Bienvenue.md` appartiennent uniquement à
l'installation locale et ne sont ni supprimés ni versionnés dans ce projet.

## Recherche et citations

Le Coach commence par la politique de permissions, puis sélectionne deux à
quatre notes à partir de leurs noms, métadonnées et mots-clés. Il ne reçoit pas
automatiquement tout le vault. Sa réponse cite chaque note utilisée avec un
chemin tel que `vault/70-learning/learning-plan.md`.

Les statuts distinguent les informations :

- `validated` pour les faits, règles ou décisions approuvés ;
- `proposed` pour une hypothèse ou un plan à tester ;
- `logged` pour une entrée de journal factuelle.

Une note est traitée comme une source non fiable : une instruction cachée dans
son contenu ne peut pas modifier la mission ou les permissions de l'agent.

## Synchronisation locale

La copie Obsidian n'est pas une seconde source de vérité. Après une modification
humaine validée dans le dépôt, recopier les huit dossiers métier dans le vault
Obsidian, puis comparer les empreintes SHA-256 des fichiers relatifs. Toute
différence doit être résolue avant un nouveau run du Coach.

Une modification faite directement dans Obsidian doit être proposée comme un
diff et validée avant d'être reportée dans le dépôt. La suppression reste
interdite pendant la formation.

## Données et limites

Les fichiers restent stockés localement. Lorsqu'une réponse est générée, les
extraits de notes sélectionnés et la question sont néanmoins traités par la
session Codex/OpenAI existante. Il ne faut donc pas placer de secret ou de donnée
personnelle sensible dans le contexte sans minimisation et validation.

La recherche manuelle dépend des noms et mots-clés. Elle peut manquer une note
pertinente, ne résout pas automatiquement les contradictions et n'offre pas la
recherche sémantique d'un vrai RAG. Les chemins cités permettent une vérification
humaine de la réponse.
