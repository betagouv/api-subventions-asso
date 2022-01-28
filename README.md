# Data Subvention

Pour le fonctionnement de l'app, vous devez avoir Node.js et NPM d'installer.
Installer les dépendances avec `npm install`.
Puis il faut créer un fichier .env à la racine du projet, avec au moins la variable JWT_SECRET déclarer.

Pour fonctionner l'api doit pouvoir se connecter à une base de données mongoDB.    
Par défaut, elle se connecte à l'url suivante: `mongodb://localhost:27017/datasubvention`.    
Il est possible de paramétrer ses informations via les variables d'environnements. Voir le fichier `configurations/mongo.conf.ts`.

Vous pouvez utiliser docker pour simplifier l'installation de MongoDB avec les commandes suivantes :   
`sudo docker pull mongo`   
`sudo docker run -d -p 27017:27017 mongo`   

## Démarrer l'app en local

1. Run `npm run dev`
2. Visit [http://localhost:8080](http://localhost:8080)

## Executer une commande

1. Run `npm run cli [controller name] [method name] [...arguments]`

## Démarrer les tests et le coverage

1. Run `npm run test`

## Choix technique et architecture

Le projet uttilisent la stack technique suivante:

* NodeJs
* Typescript
* Express
* MongoDB

L'architecture utilisée est une inspiration libre de la clean architecture (Voir aussi architecture Oignon et Hexagonal). Le concept n'est pas poussé à fond, pour une question de rapidité de mise en place et pour garder un maximum de souplesse en cas de changement radical du produit.

MongoDB a été choisi pour sa simplicité d'utilisation et de mise en place. L'architecture permettra de change de système de base de données ou d'utiliser un ORM .

Il est important de notés que chaque module ne peut communiquer avec un autre module SEULEMENT via le service de l'autre module. Il est préférable que chaque service qui est utilisé par un autre module décrive une interface (dans un fichier séparé) auquel le service répond. Ainsi si le service change il sera forcer de continuer à repondre à ce contrat avec les autres modules.

Il faut au maximum évitée l'inter-dépendance entre modules.

Le code de logique métier doit être uniquement écrit dans les services. C'est aux interfaces (HTTP, CLI…) de formater les données renvoyer par les services à leurs interlocuteurs. L'accès à la base de données doit ce faire exclusivement dans les repositories pour faciliter le développement en cas de refactorisation.

## Tests et Coverage

Pour la partie tests, il est demandé que chaque feature soit tester avec au moins un test.
Le PR ne doivent pas être merger si le taux de couverture est inférieur à 85% et tendant toujours vers 100% du code couvert par les tests.
