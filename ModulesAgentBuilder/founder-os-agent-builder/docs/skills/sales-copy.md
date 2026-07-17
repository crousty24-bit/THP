# Skill — Sales copy

## Quand l'utiliser

Utiliser ce skill pour rédiger une réponse, une relance ou une proposition
commerciale en brouillon. Ne pas l'utiliser pour envoyer un message ou prendre
un engagement non validé.

## Entrées attendues

- demande et contexte autorisé du destinataire ;
- offre, ton, prix et périmètre validés ;
- destinataire et objet, confirmés ou explicitement provisoires ;
- points inconnus et prochaine action souhaitée.

## Sortie attendue

Produire l'enveloppe `email_draft` définie dans les sorties structurées avec
`action: draft_email_reply`. Inclure destinataires, objet, corps, points non
résolus, identifiant source éventuel et `gmail_draft_created: false`.

## Méthode

1. Extraire les faits et points à confirmer.
2. Reformuler le besoin en une phrase fidèle.
3. Présenter seulement l'offre et les conditions validées.
4. Rédiger un message court avec une seule prochaine action.
5. Relire destinataire, objet, ton, prix, promesses et données exposées.
6. Marquer clairement que le résultat est un brouillon non envoyé.

## Garde-fous

- Ne jamais envoyer le message ni créer un brouillon Gmail sans approbation.
- Avant une création Gmail, produire `request_human_approval` avec destinataire,
  objet et contenu exacts. Cette approval n'autorise jamais l'envoi.
- Ne pas inventer résultat, délai, remise, disponibilité ou validation.
- Ne pas modifier un prix approuvé ni exposer une donnée client inutile.
- Utiliser des adresses `.test` dans les simulations versionnées.

## Exemple

Répondre à `prospect@example.test` en demandant les pages, contenus et échéance,
présenter 1 890 € HT comme tarif fictif de référence à confirmer, puis conserver
`gmail_draft_created` à `false`.
