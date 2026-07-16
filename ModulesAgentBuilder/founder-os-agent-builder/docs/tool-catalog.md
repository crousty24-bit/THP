# Catalogue d'actions

## Principes communs

Chaque action produit une sortie structurée conforme à
`docs/structured-outputs.md`. Une action ne peut être appelée que par les agents
indiqués et avec le minimum de données nécessaire. Les validations portent sur
une action précise : elles ne donnent jamais une autorisation permanente ni le
droit d'exécuter l'étape suivante.

Les statuts de sortie possibles sont `success`, `needs_input`, `blocked` et
`error`. Une sortie `blocked` décrit le motif du blocage sans exécuter l'action
sensible.

## `prepare_product_brief`

- **Mission :** transformer une demande qualifiée en périmètre produit et
  critères d'acceptation vérifiables avant production.
- **Agents autorisés :** Agent Code / Produit.
- **Entrées :** besoin, audience, objectifs, contraintes, contenus, offre et
  inconnues.
- **Sortie attendue :** schéma `product_brief` avec périmètre inclus et exclu,
  livrables, critères d'acceptation, inconnues, risques et prochaine action.
- **Permissions :** analyser et produire un brouillon local ; aucune modification
  de code ou de fichier projet.
- **Risques :** inventer une fonctionnalité, masquer une inconnue, confirmer un
  prix ou un délai et élargir silencieusement le périmètre.
- **Approbation requise :** non pour le brief local ; oui avant modification de
  fichier, dépendance, changement de périmètre ou déploiement.
- **Stack utilisée :** locale et simulée avec Codex.

## `qualify_lead`

- **Mission :** reformuler une demande entrante, mesurer son adéquation avec les
  offres du studio et identifier les informations manquantes.
- **Agents autorisés :** Orchestrateur et Agent Prospection.
- **Entrées :** demande assainie, secteur, besoin, budget, échéance et source des
  données lorsque ces éléments sont disponibles.
- **Sortie attendue :** schéma `lead_qualification` avec résumé, score, niveau
  d'adéquation, besoins, budget, échéance, informations manquantes et prochaine
  action recommandée.
- **Permissions :** analyser localement des données fictives ou des données de
  prospects déjà autorisées. L'import, l'enrichissement ou la transmission de
  données réelles reste soumis à validation.
- **Risques :** surévaluer un prospect, inventer un budget ou une échéance,
  exposer des données personnelles et confondre hypothèse avec fait.
- **Approbation requise :** non pour une qualification locale assainie ; oui
  avant tout import, enrichissement, export ou action externe sur un prospect
  réel.
- **Stack utilisée :** locale et simulée avec Codex ; cloud/API seulement après
  validation lorsque des données réelles sont concernées.

## `draft_email_reply`

- **Mission :** préparer une réponse fidèle à la demande et au contexte du fil,
  sans envoyer le message.
- **Agents autorisés :** Agent Mail / Sales, sous contrôle de l'Orchestrateur.
- **Entrées :** demande reçue, destinataires autorisés, objet, derniers messages
  utiles, ton souhaité, offre validée et points à confirmer.
- **Sortie attendue :** schéma `email_draft` avec destinataires, objet, corps,
  points non résolus, référence facultative au message source et indicateur de
  création dans Gmail.
- **Permissions :** produire un brouillon local est autorisé. Rechercher ou lire
  dans Gmail exige une demande explicite et un périmètre minimisé. Créer le
  brouillon dans Gmail est une écriture cloud qui exige une validation ciblée.
  L'envoi n'appartient pas à cette action.
- **Risques :** mauvais fil ou destinataire, divulgation de données, réponse à
  tous injustifiée, engagement commercial non validé ou envoi accidentel.
- **Approbation requise :** non pour le contenu local ; oui avant l'appel à
  `gmail_create_draft`. Cette approbation ne permet jamais l'envoi.
- **Stack utilisée :** locale avec Codex pour la rédaction ; cloud/API avec le
  connecteur Gmail pour la recherche, la lecture et la création optionnelle du
  brouillon.

### Workflow Gmail disponible

Le connecteur Gmail déjà branché peut être utilisé dans cet ordre :

1. `gmail_search_emails` recherche le message avec une requête Gmail bornée par
   expéditeur, objet, date ou libellé ; une recherche générale de la boîte est
   évitée ;
2. `gmail_read_email_thread` lit le dernier message et uniquement le contexte
   récent nécessaire pour comprendre la demande, le ton et les destinataires ;
3. Founder OS produit `email_draft` et signale séparément les faits manquants ;
4. après validation explicite du destinataire, de l'objet et du contenu,
   `gmail_create_draft` crée le brouillon avec le `reply_message_id` réel afin de
   le rattacher au bon fil ;
5. la sortie passe à `gmail_draft_created: true`, mais le message reste dans les
   brouillons.

Aucune action d'envoi, d'archivage, de suppression ou de modification de
libellé ne fait partie de ce workflow. Les identifiants Gmail, adresses réelles
et contenus personnels ne doivent pas être copiés dans les preuves du dépôt.

## `create_mock_quote`

- **Mission :** produire une estimation pédagogique et non contractuelle à
  partir des offres fictives du brief.
- **Agents autorisés :** Agent Admin / Compta, avec l'Agent Mail / Sales pour la
  formulation commerciale.
- **Entrées :** identité fictive ou libellé assaini, offre, quantité, prix HT du
  brief, périmètre et hypothèses.
- **Sortie attendue :** schéma `mock_quote` avec identifiant, marqueur
  `fictitious`, lignes chiffrées, total HT, devise et avertissements.
- **Permissions :** générer localement un devis portant explicitement la mention
  « fictif — non contractuel » ; aucun numéro légal, taxe, signature ou donnée
  d'entreprise réelle ne doit être inventé.
- **Risques :** présentation comme document réel, erreur de calcul, prix non
  validé, obligations légales omises ou engagement commercial implicite.
- **Approbation requise :** non tant que le document reste fictif et local ; la
  transformation en document commercial réel est hors périmètre.
- **Stack utilisée :** locale et simulée avec les tarifs de
  `docs/business-brief.md`.

## `extract_seo_keywords`

- **Mission :** extraire des thèmes, intentions et mots-clés utiles à partir
  d'un brief ou de sources autorisées.
- **Agents autorisés :** Agent SEO / Marché.
- **Entrées :** offre, cible, zone géographique, contenu source, langue et
  objectif de recherche.
- **Sortie attendue :** liste structurée de mots-clés avec intention, thème,
  priorité qualitative, source et limites ; aucun volume ne doit être inventé.
- **Permissions :** analyser localement le brief et des sources publiques
  citées. Tout service externe doit être signalé ; toute API payante nécessite
  une validation préalable.
- **Risques :** faux volumes, source obsolète, transmission de contenu sensible,
  coût non annoncé et recommandations trop affirmatives.
- **Approbation requise :** non pour une extraction locale ; oui avant une API
  payante, une collecte massive ou l'envoi de données sensibles dans le cloud.
- **Stack utilisée :** locale par défaut ; cloud/API optionnelle et déclarée.

## `search_knowledge_base`

- **Mission :** retrouver une information vérifiable dans la mémoire locale du
  projet et répondre avec ses sources.
- **Agents autorisés :** Agent Coach / Apprentissage et Orchestrateur.
- **Entrées :** requête, chemins ou périmètre de notes explicitement autorisés et
  nombre maximal de résultats.
- **Sortie attendue :** schéma `knowledge_search` avec réponse, chemins des
  sources, extraits pertinents et limites.
- **Permissions :** lecture seule des documents et notes autorisés ; chaque
  source utilisée doit être citée. Aucun contenu privé n'est envoyé à un autre
  service sans validation.
- **Risques :** lecture trop large, note obsolète, citation imprécise, invention
  d'une décision passée ou exposition d'une note privée.
- **Approbation requise :** non pour les fichiers explicitement autorisés ; oui
  avant d'élargir le périmètre à une note sensible ou de transmettre son contenu
  dans le cloud.
- **Stack utilisée :** locale, notamment fichiers Markdown et vault Obsidian.

## `write_note_draft`

- **Mission :** proposer le contenu d'une note de mémoire sans modifier le vault
  permanent.
- **Agents autorisés :** Agent Coach / Apprentissage, sous contrôle de
  l'Orchestrateur.
- **Entrées :** titre, objectif, faits sourcés, liens vers les preuves et dossier
  cible proposé.
- **Sortie attendue :** chemin proposé, contenu Markdown complet, sources et
  avertissement indiquant que l'écriture permanente n'a pas eu lieu.
- **Permissions :** préparer le texte localement. Toute création ou modification
  permanente dans Obsidian exige de présenter le chemin, le contenu exact ou le
  diff avant validation.
- **Risques :** enregistrer une hypothèse comme fait, écraser une note, dupliquer
  une décision, conserver une donnée personnelle ou écrire sans accord.
- **Approbation requise :** non pour le brouillon ; oui pour chaque écriture ou
  modification permanente du vault.
- **Stack utilisée :** locale avec Markdown et Obsidian ; aucune API requise.
