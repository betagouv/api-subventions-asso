# Data.Subvention - Front

Vous pouvez voir ce site en ligne ici : https://datasubvention.beta.gouv.fr.

## Lancer

### en prod

```
npm start
```

### en dev

`npm run dev` puis accès sur http://dev.local:5173

## Mettre à jour le Design System

-   Modifier la version de `@gouvfr/dsfr` dans `package.json`
-   Lancer la commande

```
npm install
```

-   Modifier les templates selon la note de version

## Conventions de Code

### API

Le format des attributs de l'API est le snake_case.

L'API retourne des données identifiées en français. Les attributs JSON seront donc écrits en français pour faciliter la compréhension des utilisateurs. Il en va de même pour le nom des ressources HTTP.

On préférera donc `/utilisateur` à `/user` et `{ etablissement: [] }` à `establishment: []`.

### Code Source

Le format camelCase doit être utilisé pour toute définition de variable dans le code.

La totalité du code source doit être en anglais. La création de variables à partir de retour de l'API devra se traduire en anglais.

Exemple : `const establishment = association.etablissement // retour API en français mais variable en anglais`

## Git

### MERGE vs REBASE

`rebase` uniquement dans des branches qui n'ont pas encore été mergées dans aucune des trois branches `develop`, `main` ni `PROD`
`merge` pour fusionner `develop` dans `main` et `main` dans `PROD` mais aussi pour les `hotfix`.  Dans le cas de branches filles vers branche mère, penser à utiliser l'option git `--ff-only` pour mettre en lumière des potentielles incohérences d'historique.
Les `hotfix` sont à merger sur la branche mère `PROD` ou `main`. Il faut esnuite merge successivement des branches mères vers les branches filles (`PROD` vers `main` puis `main` vers `dev`)

## Architecture Svelte

Le package Front est divisé comme suit et selon la [doc SvelteKit](https://kit.svelte.dev/docs/project-structure):

```
src
│
└───lib                                      // Contient tous les composants Svelte métier
│    │                                       
│    └───components                          // Contient tous les composants Svelte métier
│    │   │                                   
│    │   │                                   
│    │   └───Foo                             // Il existe autant de sous répertoire que de composants "intelligent"
│    │       │   Foo.svelte                  // Composant graphique Svelte (dumb)
│    │       │   Foo.controller.js           // Contrôleur qui s'occupe de récupérer/calculer la donnée renvoyée au composant graphique
│    │       │   ...                         
│    │                                       
│    └───core                                // Contient quelques fichiers "essentiels", comme le connecteur SSE
│    │                                       
│    └───dsfr                                // Contient tous les composants Svelte liés au composant du DSFR
│    │                                       
│    └───helpers                             // Contient des helpers spécifiques à un champ particulier (string, date, etc)
│    │                                       
│    └───resources                           // Contient les connecteurs (ports) HTTP
│    │                                       
│    └───services                            // Contient des services métiers qui ne sont pas liés à un composant ou à une ressource
│    │                                       
│    └───store                               // Contient une liste de stores globaux
│                                            
└───routes                                   
│    │                                       
│    └───example-route                       // nom de la route (voir routing)
│    │   │                                   
│    │   └───components                      // Contient des composants spécifiques à la route en question. Même architecture que pour les composants dans libs
│    │   │                                   
│    │   └───+page.ts                        // Il existe autant de sous répertoire que de composants "intelligent"
│    │   │                                   
│    │   └───+page.svelte                    // Il existe autant de sous répertoire que de composants "intelligent"
│    │   │                                   
│    │   └───+route.ts                       // Il existe autant de sous répertoire que de composants "intelligent"
│    │                                       
│    └───...                                 // Autant de routes que nécessaire
│    │                                       
│    └───   +error.svelte                    // Page d'erreur (notamment 404)
│    │                                       
│    └───   +layout.svelte                   // Contient le layout général (header, etc)
│    │                                       
│    └───   +layout.ts                       // Contient la logique qui doit s'appliquer pour toutes les pages
                                             
│   main.js                                  // Point d'entrée de l'application
│   global.css                               // Fichier CSS global
│   app.html                                 // Coquille minimale autour des composants svelte
│   hooks.server.ts                          // Hooks serveur. Permet notammer de spécifier les headers
```

## Gestion des routes (SvelteKit)

Le routing est géré par SvelteKit à partir de l'architecture de fichiers dans `src/routes` (cf [doc SvelteKit](https://kit.svelte.dev/docs/routing))
Pour spécifier le niveau d'autorisation associé à une route, on peut
- placer le code dans le dossier `(noAuth)` qui n'impacte pas le chemin url mais qui ajoute des propriétés aux routes qu'il contient (cf [doc SvelteKit](https://kit.svelte.dev/docs/advanced-routing#advanced-layouts))
- spécifier dans un `+layout.ts` ou le `+page.ts` associé à la page correspondante la donnée `authLevel`. Voir comme exemple `src/routes/auth/+layout.ts`. 

Pour l'instant le fil d'ariane n'est pas dynamique. Il faut donc le spécifier dans `$lib/services/router.service > buildBreadcrumbs`

## CSS 

Utiliser le moins possible de CSS dans les composants Svelte. Le DSFR met à disposition des classes pour le positionnement et l'espacement. Si ces dernières ne répondent pas au besoin et qu'il est redondant, il faut alors créer une classe générique dans `src/global.css`. Si c'est un besoin vraiment spécifique au composant, il faut d'abord s'assurer avec l'équipe design si ce n'est pas réalisable avec le DSFR en modifiant légèrement le composant. Dans le cas où il n'y a pas le choix, il faudra nommer la classe CSS le plus proche possible de l'effet désiré.

## Interactions entre composants et contrôleurs

Le composant ne doit faire qu'afficher la donnée. Tous traitements et récupérations de données doit se faire à l'aide du contrôleur associé qui délèguera si nécessaire à des services.
Si besoin, le composant doit s'initialiser en appelant `controller.init()`.
`controller.init()` doit appeler d'autres méthodes et ne contenir aucun code métier.

Exemple :

```js
async function init() {
    await doSomthing();
    await doSomethingElse();
}
```

## Redirections

Les redirections en interne de l'app doivent être gérées par les controllers JS car ce sont eux qui sont en charge de l'interface avec le navigateur (browser).

## Tests unitaires

Les tests unitaires sont réalisés via le framework vitest, qui reprend l'interface de jest.

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
        const otherFunctionMock = vi.spy(moduleName, "otherFunction");
        moduleName.doSomething();
        expect(otherFunctionMock).toHaveBeenCalledWith(...expected);
    });
});
```

