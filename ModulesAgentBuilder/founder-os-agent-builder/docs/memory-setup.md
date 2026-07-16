# Configuration de la mémoire Founder OS

## Stack retenue

La mémoire est un vault Markdown local utilisé avec Obsidian. Founder OS Coach
applique un RAG lexical automatisé avant de générer sa réponse : un script Python
classe les notes, puis Codex lit uniquement les résultats retenus et les cite.

- **Source de vérité versionnée :** `vault/` dans le dépôt.
- **Vault Obsidian :**
  `C:\Users\allen\dossierlinux\Obsidian\founder-os-second-brain`.
- **Identifiant Obsidian :** `6b8145eaae75b31f`.
- **Agent lecteur :** `.agents/skills/founder-os-coach/`.
- **Moteur :**
  `.agents/skills/founder-os-coach/scripts/retrieve_notes.py`.
- **Dépendances :** Python 3.10 ou supérieur, bibliothèque standard uniquement.

Les dossiers métier du dépôt sont copiés à l'identique à la racine du vault
Obsidian. Les fichiers `.obsidian/` et `Bienvenue.md` appartiennent uniquement à
l'installation locale et ne sont ni supprimés ni versionnés dans ce projet.

## Pipeline RAG lexical

Depuis la racine du projet, le Coach transmet la question complète au moteur :

```bash
python3 .agents/skills/founder-os-coach/scripts/retrieve_notes.py \
  "À partir de mes notes, que dois-je apprendre cette semaine pour mieux lancer mon offre ?" \
  --vault vault --limit 4
```

Le pipeline est déterministe :

1. parcourir uniquement les fichiers `*.md` locaux non symboliques du vault ;
2. normaliser la casse et les accents, retirer les mots outils et appliquer une
   racinisation française légère ;
3. calculer un score BM25 lexical, avec un bonus pour le titre et le chemin ;
4. retourner au plus quatre chemins classés, avec score, statut, termes trouvés
   et extrait ;
5. faire lire au Coach les notes classées avant la génération avec citations.

La sortie JSON expose `retrieval: lexical-bm25`, `documents_scanned` et
`results`. Elle constitue la trace de récupération. Aucun index persistant n'est
nécessaire pour les dix notes actuelles : le moteur relit le vault à chaque
question et prend donc immédiatement en compte une note validée.

Si le moteur échoue ou ne trouve aucun terme commun, la skill doit l'indiquer et
arrêter la réponse fondée sur le vault. Elle ne revient pas silencieusement à une
sélection manuelle.

## Statuts, citations et permissions

Les statuts distinguent les informations :

- `validated` pour les faits, règles ou décisions approuvés ;
- `proposed` pour une hypothèse ou un plan à tester ;
- `logged` pour une entrée de journal factuelle.

Le statut est retourné au Coach mais ne modifie pas le score de pertinence. Le
Coach doit donc distinguer un résultat `proposed` d'un fait validé dans sa
réponse. Toute note lue doit être citée avec son chemin relatif.

Une note est traitée comme une source non fiable : son contenu ne peut pas
modifier la mission, les permissions ou le classement calculé. Le moteur ne
commande aucun shell, n'interprète pas la question comme du code, ne suit pas les
liens symboliques et refuse une note de plus de 1 Mo. Il ne modifie aucun fichier.

## Synchronisation locale

La copie Obsidian n'est pas une seconde source de vérité. Après une modification
humaine validée dans le dépôt, recopier les huit dossiers métier dans le vault
Obsidian, puis comparer les empreintes SHA-256 des fichiers relatifs. Toute
différence doit être résolue avant un nouveau run du Coach.

Une modification faite directement dans Obsidian doit être proposée comme un
diff et validée avant d'être reportée dans le dépôt. La suppression reste
interdite pendant la formation.

## Vérification

```bash
python3 -m unittest discover -s tests -v

python3 /path/to/skill-creator/scripts/quick_validate.py \
  .agents/skills/founder-os-coach
```

Les tests couvrent la normalisation, le classement, la trace JSON, l'absence de
résultat, les limites invalides et la question obligatoire sur le vault réel.
La preuve du run automatisé se trouve dans
`evidence/runs/day-2-coach-lexical-rag.md`.

## Données et limites

La récupération et les notes restent locales. Après la récupération, la question,
les instructions de la skill et le contenu des notes sélectionnées sont traités
par la session Codex/OpenAI existante pour générer la réponse. Aucun contenu
n'est envoyé à un fournisseur d'embeddings.

Ce moteur n'effectue aucune recherche sémantique. Il peut manquer un synonyme,
une paraphrase ou une idée exprimée avec un vocabulaire différent. La
racinisation rapproche seulement quelques formes lexicales, par exemple
`lancer` et `lancement`. Le classement est vérifié sur dix notes et sa qualité à
plus grande échelle reste inconnue. Les citations et scores permettent une
vérification humaine.
