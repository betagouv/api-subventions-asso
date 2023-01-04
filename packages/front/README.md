# Data.Subvention - Front

Vous pouvez voir ce site en ligne ici : https://datasubvention.beta.gouv.fr.

## Lancer en prod

```
npm start
```

## Mettre à jour le Design System

-   Modifier la version de `@gouvfr/dsfr` dans `package.json`
-   Lancer la commande

```
npm install
```

-   Modifier les templates selon la note de version

## Git

### MERGE vs REBASE

`rebase` tout le temps si la branche parent à été modifiée.
`merge` uniquement pour fusionner develop dans main et main dans PROD.
Les `hotfix` sont à `rebase` sur la branche fille et à `merge` dans la branche parent

## Architecture Svelte

En plus de la documentation qui suit, le point d'entrée de l'application est `./static/svelte-index.html`.

Le package Front est divisé comme suit :

```
svelte
│   main.js                             // Point d'entrée de l'application
│   routes.js                           // Définition des routes (nom et composant)
│   App.svelte                          // Point d'entrée Svelte
│   global.css                          // Fichier CSS global
│
└───components                          // Contient tous les composants Svelte métier
│   │
│   │
│   └───Foo                             // Il existe autant de sous répertoire que de composants "intelligent"
│       │   Foo.svelte                  // Composant graphique Svelte (dumb)
│       │   Foo.controller.js           // Contrôleur qui s'occupe de récupérer/calculer la donnée renvoyée au composant graphique
│       │   ...
│
└───core                                // Contient quelques fichiers "essentiels", comme le connecteur SSE
│
└───dsfr                                // Contient tous les composants Svelte liés au composant du DSFR
│
└───helpers                             // Contient des helpers spécifiques à un champ particulier (string, date, etc)
│
└───resources                           // Contient les connecteurs (ports) HTTP
│
└───services                            // Contient des services métiers qui ne sont pas liés à un composant
│
└───store                               // Contient une liste de stores globaux
│
└───views                               // Contient les composants liés aux vues principales
```

## Gestion des routes (svelte)

Le routing Svelte est géré par deux parties :

-   Le composant Router, implémenter dans le composant principal de l'application (App.svelte)
-   Le fichier routes.js qui définie les composants principaux pour chaque route

Pour ajouter une nouvelle route, il suffit de rajouter sa définition dans le fichier routes.js avec le bon composant à afficher.

## CSS

Utiliser le moins possible de CSS dans les composants Svelte. Le DSFR met à disposition des classes pour le positionnement et l'espacement. Si ces dernières ne répondent pas au besoin et qu'il est redondant, il faut alors créer une classe générique dans `svelte/global.css`. Si c'est un besoin vraiment spécifique au composant il faut d'abord s'assurer avec l'équipe design si ce n'est pas réalisable avec le DSFR en modifiant légèrement le composant. Dans le cas ou il n'y a pas le choix, il faudra nommer la classe CSS le plus proche possible de l'effet désiré.

## Intéractions entre composants et contrôleurs

Le composant ne doit faire qu'afficher la donnée. Tous traitements et récupérations de données doit se faire à l'aide du contrôleur associé qui délèguera si nécessaire à des services.
Si besoin, le composant doit s'initialiser en appelant `controller.init()`.
`controller.init()` doit appeler d'autres méthodes et ne contenir aucun code métier.

Exemple:

```js
async function init() {
    await doSomthing();
    await doSomethingElse();
}
```

## Tests unitaires

```js
describe("front end app unit tests examples", () => {
    describe("test return value", () => {
        it("should return true", () => {
            const expected = true;
            const actual = true;
            expect(actual).toBe(expected);
        });
    });
    describe("test fonction call", () => {
        const expected = [true, {}];
        const otherFunctionMock = jest.spy(moduleName, "otherFunction");
        moduleName.doSomething();
        expect(otherFunctionMock).toHaveBeenCalledWith(...expected);
    });
});
```
