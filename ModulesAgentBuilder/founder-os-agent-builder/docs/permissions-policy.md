# Politique de permissions

## Principes

- Accorder uniquement les droits nécessaires à la tâche en cours.
- Bloquer l'action avant exécution lorsque la validation humaine est requise.
- Ne jamais considérer une absence de réponse comme une approbation.
- Tracer la demande, la décision humaine et le résultat de toute action sensible.
- Ne jamais placer de secret, clé API ou donnée personnelle brute dans une trace.

## Matrice des actions

| Action | Statut | Conditions ou limites |
| --- | --- | --- |
| Lire le brief et les documents non sensibles du projet | Autorisée | Accès limité aux fichiers utiles à la tâche. |
| Lire une note locale explicitement autorisée | Autorisée | La note utilisée doit être citée dans la sortie. |
| Produire une analyse, un brouillon ou une checklist locale | Autorisée | Le livrable doit rester marqué comme brouillon si nécessaire. |
| Préparer un brouillon de note Obsidian | Autorisée | Produire le chemin proposé et le contenu complet sans écrire dans le vault permanent. |
| Créer une trace de run ou une preuve locale assainie | Autorisée | Aucun secret ni donnée personnelle inutile. |
| Générer un devis fictif | Autorisée | Le document doit porter clairement la mention « fictif — non contractuel » et ne contenir aucun identifiant légal inventé. |
| Rechercher ou lire dans Gmail | Validation humaine obligatoire | La demande doit préciser le but et le périmètre ; limiter la requête, le nombre de messages et le contexte lu. |
| Créer un brouillon dans Gmail | Validation humaine obligatoire | Faire approuver le destinataire, l'objet et le contenu exact. Cette validation ne permet pas l'envoi. |
| Envoyer un mail ou un message réel | Interdite | Founder OS prépare uniquement des brouillons dans le périmètre actuel. |
| Écrire ou modifier une note permanente du vault Obsidian | Validation humaine obligatoire | Présenter le chemin, le diff ou le contenu exact avant chaque écriture. |
| Modifier un fichier permanent du projet | Validation humaine obligatoire | Présenter le périmètre, le diff attendu et les vérifications. |
| Transformer un devis fictif en document commercial réel | Interdite | Les devis du catalogue restent fictifs ; la création d'un document réel est hors périmètre. |
| Utiliser une API payante | Validation humaine obligatoire | Avant l'appel, annoncer le fournisseur, les données envoyées, la finalité et le coût estimé. |
| Importer ou enrichir des données de prospects réels | Validation humaine obligatoire | Vérifier source, finalité, minimisation et droit d'utilisation. |
| Envoyer une donnée sensible vers un service cloud | Validation humaine obligatoire | Anonymiser si possible et préciser le fournisseur et la finalité. |
| Déployer ou publier un livrable | Validation humaine obligatoire | Le livrable et la destination doivent être explicitement approuvés. |
| Effectuer un paiement ou mouvement financier | Interdite | Founder OS ne dispose d'aucun pouvoir de paiement. |
| Effectuer une déclaration comptable, fiscale ou légale réelle | Interdite | Intervention d'une personne responsable ou d'un professionnel requis. |
| Scraper, acheter ou utiliser illégitimement des données personnelles | Interdite | Aucune dérogation possible. |
| Révéler, journaliser ou committer un secret | Interdite | Utiliser une configuration locale ignorée lorsque ce sera nécessaire. |
| Contourner une validation ou exécuter une action irréversible non approuvée | Interdite | L'orchestrateur doit arrêter le run et tracer le refus. |

## Validation humaine

Une demande de validation doit décrire l'action, les données concernées, le
destinataire ou système cible, le coût éventuel, le résultat attendu et les
risques. L'approbation doit être explicite et limitée à cette action. Toute
modification substantielle impose une nouvelle validation.

Un refus ou une absence de validation arrête l'action sensible, sans empêcher la
production d'un brouillon local non sensible. La décision est enregistrée dans
la trace de run.

## Règles propres à Gmail et aux preuves

Le workflow Gmail autorisé se limite à une recherche ciblée, à la lecture du
contexte nécessaire et, après validation, à la création d'un brouillon. La
recherche ou la lecture ne vaut pas autorisation de modifier la boîte. La
création d'un brouillon ne vaut pas autorisation de l'envoyer.

Les traces versionnées ne doivent contenir ni identifiant Gmail, ni adresse
réelle, ni contenu personnel brut, ni pièce jointe. Elles utilisent des données
fictives ou une synthèse assainie suffisante pour prouver le comportement.
