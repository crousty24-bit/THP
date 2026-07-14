# Run — Day 1 First Agent

## Métadonnées

- **Date :** 14 juillet 2026 à 18:10 CEST
- **Agent :** Founder OS Qualifier
- **Plateforme :** Codex, session ChatGPT existante
- **Invocation :** `$founder-os-qualifier`
- **Configuration :** `.agents/skills/founder-os-qualifier/SKILL.md`
- **Actions externes :** aucune
- **Clé API :** aucune
- **Modèle exact :** non exposé dans cette preuve ; je ne sais pas le vérifier

## Demande testée

> Un artisan me demande un site vitrine pour vendre ses prestations de
> renovation. Il veut savoir le prix, le delai et ce qu'il doit fournir.

## Sortie obtenue

# Qualification Founder OS

## Besoin reformulé

L'artisan souhaite présenter et promouvoir ses prestations de rénovation sur un
site vitrine. Il attend une estimation du prix et du délai ainsi qu'une liste des
contenus et informations à fournir. Le périmètre doit être précisé avant de
confirmer une offre ou un calendrier.

## Agents à mobiliser

- **Agent Code / Produit** — cadrer les objectifs, les pages, les fonctionnalités
  et les contenus nécessaires pour définir le périmètre du site.
- **Agent Admin / Compta** — rapprocher le besoin d'une offre fictive et préparer
  une estimation non contractuelle après cadrage.
- **Agent Mail / Sales** — préparer une réponse claire au prospect et le
  questionnaire de qualification, sans effectuer l'envoi.

## Risques

- **Risque principal :** annoncer un prix ou un délai ferme avant de connaître le
  nombre de pages, les fonctionnalités, les contenus disponibles et les
  contraintes du projet.
- Utiliser des photos, témoignages ou réalisations sans vérifier leur qualité et
  leurs droits d'utilisation.
- Confondre un site vitrine avec une fonctionnalité de vente ou de paiement en
  ligne qui modifierait fortement le périmètre.

## Validation humaine

**Requise : Oui.** Le fondateur doit valider le périmètre, le prix, le délai et
le brouillon de réponse avant tout engagement ou envoi au prospect.

## Prochaine action

Faire valider puis transmettre au prospect un questionnaire de cadrage demandant
ses objectifs, sa zone d'intervention, les prestations à présenter, le nombre de
pages souhaité, les fonctionnalités attendues, son échéance et les contenus déjà
disponibles : logo, textes, photos, réalisations, témoignages et coordonnées.

## Faits, hypothèses et inconnues

- **Faits :** le prospect est artisan, propose des prestations de rénovation,
  demande un site vitrine et souhaite connaître le prix, le délai et les
  éléments à fournir.
- **Hypothèses :** un mini-site fictivement affiché à 1 890 € HT pourrait être
  pertinent, mais cette offre ne peut pas être confirmée sans cadrage ; aucune
  vente ou paiement en ligne n'est explicitement demandé.
- **Inconnues :** objectifs prioritaires, cible, zone géographique, nombre de
  pages, fonctionnalités, échéance, budget, identité visuelle, contenus
  disponibles, droits sur les médias, hébergement et maintenance.

## Analyse qualité

La sortie satisfait les cinq éléments obligatoires : besoin reformulé, agents à
mobiliser, risque principal, validation humaine et prochaine action. Elle ajoute
la séparation faits/hypothèses/inconnues prévue par le blueprint.

Le routage est proportionné : Code / Produit cadre le besoin, Admin / Compta
prépare une estimation fictive et Mail / Sales prépare la réponse. SEO / Marché
n'est pas encore mobilisé, car la zone, la cible et l'objectif de visibilité sont
des inconnues. Prospection et Coach / Apprentissage ne sont pas utiles à cette
étape.

La réponse évite deux erreurs : elle ne transforme pas le tarif fictif du
mini-site en devis et n'invente aucun délai. Sa limite principale est qu'elle
repose sur un seul scénario et n'évalue pas encore la stabilité de la skill sur
des demandes ambiguës ou malveillantes.

## Analyse coût

Aucune clé API et aucun appel facturé par token n'ont été utilisés. Le run
consomme les droits de la session Codex/ChatGPT existante. Codex n'expose pas ici
de coût marginal ni de compteur de tokens : **je ne sais pas** chiffrer ce run.

Le coût potentiel dépend de l'abonnement ou des crédits ChatGPT déjà utilisés et
de leurs limites. Aucun achat ni dépense supplémentaire n'a été déclenché par le
projet.

## Données exposées

Codex a traité :

- la demande générique reproduite ci-dessus ;
- les instructions de la skill ;
- le brief métier, les rôles d'agents et la politique de permissions du projet.

Ces éléments ne contiennent ni identité réelle, ni adresse, ni contact, ni
secret, ni document client. Aucun contenu du vault n'a été lu. La sortie et la
preuve sont enregistrées localement dans le dépôt.

## Prochaine amélioration

Ajouter trois tests manuels : demande incomplète, tentative d'injection dans la
demande et demande contenant une donnée sensible. Vérifier que la skill conserve
son format, refuse le contournement des règles et exige la validation appropriée.
