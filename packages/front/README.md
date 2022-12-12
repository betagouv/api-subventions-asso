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


## Gestion des routes (svelte)

Le routing Svelte est géré par deux parties :

-   Le composant Router, implémenter dans le composant principal de l'application (App.svelte)
-   Le fichier routes.js qui définie les composants principaux pour chaque route

Pour ajouter une nouvelle route, il suffit de rajouter sa définition dans le fichier routes.js avec le bon composant à afficher.
```
