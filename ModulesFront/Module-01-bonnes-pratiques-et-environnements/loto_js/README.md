# Loto JS

## Consigne

Créer une page HTML qui permet de vérifier la grille de Loto d'un joueur.

Le formulaire doit demander :

- un prénom ;
- un nom ;
- une adresse email ;
- 6 nombres correspondant à la grille jouée.

Au clic sur le bouton de validation, une fonction JavaScript doit vérifier les
informations saisies, tirer 6 nombres gagnants au hasard, puis afficher si le
joueur a gagné ou perdu.

## Résultat du projet

Le projet contient :

- `index.html` : structure de la page et formulaire ;
- `style.css` : mise en forme simple de l'interface ;
- `index.js` : logique de validation et de tirage du Loto.

La page affiche les messages demandés selon les cas :

- prénom manquant ;
- nom manquant ;
- email manquant ;
- email invalide ;
- grille perdante avec affichage des nombres gagnants ;
- grille gagnante avec message de succès.

Un message supplémentaire est prévu si la grille ne contient pas 6 nombres
valides et différents entre 1 et 49.

## Fonctionnement global

1. L'utilisateur remplit le formulaire.
2. Le formulaire intercepte l'événement `submit`.
3. Les valeurs sont récupérées depuis les champs HTML.
4. La fonction `checkLoto(firstname, lastname, email, lotoNumbers)` est appelée.
5. La fonction valide les données dans cet ordre :
   - prénom ;
   - nom ;
   - email présent ;
   - format de l'email ;
   - grille complète et valide.
6. Si les données sont valides, 6 nombres gagnants sont générés.
7. La grille du joueur est comparée aux nombres gagnants.
8. Le résultat est affiché dans la page.

## Fonction `checkLoto`

La fonction principale est définie ainsi :

```js
const checkLoto = (firstname, lastname, email, lotoNumbers) => {
  // ...
};
```

Elle reçoit :

- `firstname` : prénom du joueur ;
- `lastname` : nom du joueur ;
- `email` : email du joueur ;
- `lotoNumbers` : tableau contenant les 6 nombres joués.

Elle retourne aussi le message affiché, ce qui permet de la tester facilement
avec Node.js.

La validation email utilise une regex qui impose :

- plus de 8 caractères ;
- moins de 30 caractères ;
- un `@` ;
- un seul point après le `@` ;
- 2 ou 3 lettres après le point.

Exemples :

- `user.name@mail.com` est valide ;
- `user@mail..com` est invalide ;
- `user@mail.co.uk` est invalide.

## Test manuel avec Node.js

Pour éviter d'attendre un vrai tirage gagnant, le fichier expose une fonction de
test :

```js
__setWinningNumbersForTests([1, 2, 3, 4, 5, 6]);
```

Elle force les nombres gagnants pour vérifier le message de succès.

Depuis le dossier du projet :

```bash
cd /home/allen/mes_projets/THP/loto_js
node
```

Puis dans Node :

```js
const loto = require("./index.js");

loto.__setWinningNumbersForTests([1, 2, 3, 4, 5, 6]);

loto.checkLoto("John", "Doe", "john.doe@mail.com", [1, 2, 3, 4, 5, 6]);
```

Résultat attendu :

```txt
'Félicitations, vous avez gagné 1 million!!!!!'
```

Pour quitter Node :

```js
.exit
```
