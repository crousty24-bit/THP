# Compte-rendu - Recruit App

## Objectif

Cette application React reproduit une petite partie d'un outil de recrutement :
un utilisateur peut renseigner son prénom, son nom et ses compétences. Le but
principal est de manipuler un state global avec Redux, sans authentification ni
serveur.

## Routing

L'application utilise `react-router-dom` avec deux routes :

- `/` affiche la page d'accueil `Home`.
- `/profile` affiche la page d'édition `Profile`.

Le composant `Header` reste visible au-dessus des pages. Il contient le logo,
les liens de navigation et le résumé du profil courant.

## State global Redux

Le store Redux est créé avec `createStore` et un `rootReducer` construit avec
`combineReducers`.

Deux domaines sont séparés :

- `user` stocke `firstName`, `lastName` et `fullName`.
- `skills` stocke `skills` et `skillsCount`.

`fullName` est une valeur dérivée : elle vaut `Prénom Nom` seulement si le
prénom et le nom sont tous les deux renseignés. Sinon elle vaut `null`.

`skillsCount` est aussi une valeur dérivée : elle correspond à la longueur du
tableau `skills`.

## Lecture du state

Les composants lisent les données globales avec `useSelector`.

- `Header` lit `fullName` et `skillsCount`.
- `Home` lit `fullName` et `skills`.
- `Profile` lit `firstName`, `lastName` et `skills` pour pré-remplir le
  formulaire.

Quand le profil est vide, l'interface affiche `Inconnu` et `Aucune competence`.
Quand les données existent, le header et la page d'accueil se mettent à jour
automatiquement grâce au store Redux.

## Modification du state

La page `Profile` utilise `useDispatch`.

Au submit du formulaire :

1. `FormData` récupère les valeurs des champs.
2. Le prénom et le nom sont nettoyés avec `trim()`.
3. La chaîne des compétences est transformée en tableau avec `split(',')`.
4. Chaque compétence est nettoyée avec `trim()`.
5. Les valeurs vides sont supprimées avec `filter(Boolean)`.
6. Deux actions Redux sont dispatchées :
   - `SET_USER_PROFILE`
   - `SET_SKILLS`

Après sauvegarde, un message de confirmation s'affiche sous le bouton.

## Persistance locale

Le store charge son état initial depuis `localStorage` avec la clé
`recruit-app-profile-state`.

À chaque changement du store, seules les données utiles sont sauvegardées :

- prénom ;
- nom ;
- tableau des compétences.

Les valeurs dérivées (`fullName` et `skillsCount`) sont recalculées au chargement
pour éviter de dépendre d'une donnée persistée incohérente.

Si `localStorage` est indisponible ou contient une valeur invalide, l'application
revient à l'état vide par défaut.

## Vérification

Commandes prévues :

```bash
pnpm run lint
pnpm run build
```

Comportements à vérifier dans le navigateur :

- la route `/` affiche l'accueil ;
- la route `/profile` affiche le formulaire ;
- la navigation du header fonctionne ;
- le formulaire met à jour le nom dans le header ;
- les compétences sont nettoyées et affichées sous forme de liste ;
- un refresh conserve les données grâce à `localStorage` ;
- l'interface reste lisible sur mobile.
