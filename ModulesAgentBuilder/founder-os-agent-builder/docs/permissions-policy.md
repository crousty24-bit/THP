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
| Créer une trace de run ou une preuve locale assainie | Autorisée | Aucun secret ni donnée personnelle inutile. |
| Générer un devis fictif | Autorisée | Le document doit porter clairement la mention « fictif ». |
| Envoyer un mail ou un message réel | Validation humaine obligatoire | Le contenu final, le destinataire et le canal doivent être approuvés. |
| Écrire ou modifier une note permanente du vault | Validation humaine obligatoire | Présenter le diff ou le contenu exact avant écriture. |
| Modifier un fichier permanent du projet | Validation humaine obligatoire | Présenter le périmètre, le diff attendu et les vérifications. |
| Transformer un devis fictif en document commercial réel | Validation humaine obligatoire | Vérifier identité, prix, conditions et obligations applicables. |
| Utiliser une API payante | Validation humaine obligatoire | Annoncer le fournisseur, les données envoyées et le coût estimé. |
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
la future trace de run.
