# Data Subvention API

Pour le fonctionnement de l'api, vous devez avoir Node.js et NPM d'installer.
Installer les dépendances avec `npm install`.
Puis il faut créer un fichier .env à la racine du projet, avec au moins les variables d'environements suivantes:

- JWT_SECRET
- MAIL_HOST
- MAIL_PORT
- MAIL_USER
- MAIL_PASSWORD

Pour fonctionner l'api doit pouvoir se connecter à une base de données mongoDB.  
Par défaut, elle se connecte à l'url suivante: `mongodb://localhost:27017/api-subventions-asso`.  
Il est possible de paramétrer ses informations via le fichier .env .Le nom des variables ce trouve dans `configurations/mongo.conf.ts`.

Vous pouvez utiliser docker pour simplifier l'installation de MongoDB avec les commandes suivantes :  
`sudo docker pull mongo`  
`sudo docker run -d -p 27017:27017 mongo`

## Démarrer l'api en local

1. Run `npm run dev`
2. Visit [http://localhost:8080](http://localhost:8080)

## Executer une commande

1. Run `npm run cli [controller name] [method name] [...arguments]`

### Créer son utilisateur en local

1. Run `npm run cli user create [your email]``
2. Call HTTP POST localhost:8080/auth/forget-password with the body
   `{ "email": [your email] }`
3. Get in mongodb user-reset collection and copy the token value
4. Call HTTP POST localhost:8080/auth/reset-password with the body
   `{ "password": [your new password], "token": [token from step 3] }`
5. Call HTTP POST localhost:8080/auth/login with the body
   `{ "email": [your email]}, "password": [password defined in step 4] }`

## Démarrer les tests et le coverage

1. Run `npm run test`

## Choix technique et architecture

Le projet uttilisent la stack technique suivante:

- NodeJs
- Typescript
- Express
- MongoDB

L'architecture utilisée est une inspiration libre de la clean architecture (Voir aussi architecture Oignon et Hexagonal). Le concept n'est pas poussé à fond, pour une question de rapidité de mise en place et pour garder un maximum de souplesse en cas de changement radical du produit.

MongoDB a été choisi pour sa simplicité d'utilisation et de mise en place. L'architecture permettra de change de système de base de données ou d'utiliser un ORM .

Il est important de notés que chaque module ne peut communiquer avec un autre module SEULEMENT via le service de l'autre module. Il est préférable que chaque service qui est utilisé par un autre module décrive une interface (dans un fichier séparé) auquel le service répond. Ainsi si le service change il sera forcer de continuer à repondre à ce contrat avec les autres modules.

Il faut au maximum évitée l'inter-dépendance entre modules.

Le code de logique métier doit être uniquement écrit dans les services. C'est aux interfaces (HTTP, CLI…) de formater les données renvoyer par les services à leurs interlocuteurs. L'accès à la base de données doit ce faire exclusivement dans les repositories pour faciliter le développement en cas de refactorisation.

## Tests et Coverage

Les tests sont divisés en deux parties : 

### Test unitaire

Les tests unitaires sont présents au plus proche du code testé. Leur nom doit se terminer par ```.unit.test ```. C'est sur ces test qu'est exécuté le coverage, qui a une tolérance de 85%. Un exemple type est présent dans ```/src/example.unit.test ```. Il montre l'utilisation, si possible, de deux constantes ```actual``` et ```expected``` qui sont ensuite comparés via ```expect(actual).toEqual(expected)```. Cette façon de faire forcer les tests à être unitaire et atomique, ne testant qu'une seule chose à la fois et en rendant le test lisible et compréhensible.

Le coverage se teste avec la commande ```npm run test:cov ```qui parcours tous les fichiers ```.unit.ts``` présents dans ```./src ```. Pour avoir le coverage sur un seul fichier, et ainsi s'assurer qu'un nouveau développement est bien couvert de test, on exécute la commande ```npm run test:unit [my-test-name].test -- --coverage --collectCoverageFrom=[relative/patch/to/my-test-name].ts ```.

### Test d'intégration

Les tests d'intégration sont présents dans le dosser test à la racine du projet. Leur nom de fichier se termine par ```spec.ts ```. Ils ne doivent tester que les fonctionnalités de bout en bout. Comme les routes HTTP ou les CLI. 

Pour ce faire, nous avons décidé d'utiliser le snapshot de Jest pour garder ces tests simples et concis. Dans l'example type d'un test d'intégration présent dans ```/tests/example.spec.ts```on y voit l'utilisation de ```.toMatchSnapshot() ``` qui crée un snapshot à la première exécution et qui valide le test. Il faut dans un premier temps s'assurer via un test manuel que la fonctionnalité fonctionne bien correctement. Les autres exécutions de ```.toMatchSnapshot() ``` vont ensuite comparer le snapshot présent (et versionné sur Github) à celui re-généré. Si le nouveau snapshot ne "match" pas le premier, et que c'est lié à une modification de la fonctionnalité, il est nécesaire de mettre à jour le snapshot. Pour ce faire, il faut utiliser l'option ```--updateSnapshot ``` (ou ```-u ```) de Jest. La commande pour mettre à jour tout un fichier de test est la suivante :  ``` npm run test:integ -- -u nom-du-fichier.spec ```. Mais il est également possible de mettre à jour tous les fichiers tests en même temps (```npm run test:integ -- -u ```) ou de mettre à jour le snapshot d'un seul test (a.k.a ```describe```) au sein d'un fichier (```npm run test:integ -- nom-du-fichier.spec -u -t test-name ```).

