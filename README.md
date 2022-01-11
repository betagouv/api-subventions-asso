# Data Subvention

Pour le fonctionnement de l'app, vous devez avoir installé Node.js et NPM.
Vous devez également installer les dépendances avec `npm install`.

Pour fonctionner l'api doit pouvoir se connecter à une base de données mongoDB.    Par défaut, elle se connecte à l'url suivante: `mongodb://localhost:27017/datasubvention`.    Il est possible de paramétrer ces informations via les variables d'environnements. Voir le fichier `configurations/mongo.conf.ts`.

## Démarrer l'app en local

1. Run `npm run dev`
2. Visit [http://localhost:8080](http://localhost:8080)

## Démarrer les tests et le coverage

1. Run `npm run test`

## Choix technique et architecture

Le projet utilise la stack technique suivante:

* NodeJs
* Typescript
* Express
* MongoDB

L'architecture utilisée est une inspiration libre de la clean architecture (Voir aussi architecture Oignon et Hexagonal). Le concept n'est pas poussé à fond, pour une question de rapidité de mise en place et pour garder un maximum de souplesse en cas de changement radical du produit.

MongoDB a été choisi pour sa simplicité d'utilisation et de mise en place. L'architecture permettra de changer de système de base de données ou d'utiliser un ORM .

Il est important de noter que chaque module ne peut communiquer avec un autre module SEULEMENT via le service de l'autre module. Il est préférable que chaque service qui est utilisé par un autre module décrive une interface (dans un fichier séparé) auquel le service répond. Ainsi si le service change il sera forcé de continuer à repondre à ce contrat avec les autres modules.

Il faut au maximum éviter l'inter-dépendance entre modules.

Le code de logique métier doit être uniquement écrit dans les services. C'est aux interfaces (HTTP, CLI…) de formater les données renvoyées par les services à leurs interlocuteurs. L'accès à la base de données doit ce faire exclusivement dans les repositories pour faciliter le développement en cas de refactorisation.
