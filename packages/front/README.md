# Data.Subvention - Front

Vous pouvez voir ce site en ligne ici : https://datasubvention.beta.gouv.fr.

## Lancer en prod

```
npm start
```

Ce repo contient tout ce qu'il faut pour tourner sur Scalingo. Il suffit de déployer la branche main sur votre instance Scalingo.

## Tester que le HTML d'un site est valide

```
npm run checkHTML --  <url du site à tester>
```

Si on veut checker pour une PR donnée, utiliser l'url de la review app de la PR (voir les checks dans la PR).

## Lancer ce site localement

Vous devez avoir npm installé sur votre machine.

```
git clone https://github.com/betagouv/template-design-system-de-l-etat
cd template-design-system-de-l-etat
npm install
npm run dev
```

## Mettre à jour le Design System

-   Modifier la version de `@gouvfr/dsfr` dans `package.json`
-   Lancer la commande

```
npm install
```

-   Modifier les templates selon la note de version

## Voir la documentation locale du DSFR

```
cd node_modules/@gouvfr/dsfr && npx http-server -o
```

## Gestion des routes (svelte)

Le routing Svelte est géré par deux parties :

-   Le composant Router, implémenter dans le composant principal de l'application (App.svelte)
-   Le fichier routes.js qui définie les composants principaux pour chaque route

Pour ajouter une nouvelle route, il suffit de rajouter sa définition dans le fichier routes.js avec le bon composant à afficher.
