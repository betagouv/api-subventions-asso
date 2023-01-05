# Data.Subvention API

## Choix technique et architecture

Le projet utilisent la stack technique suivante :

-   NodeJs
-   Typescript
-   Express
-   MongoDB

L'architecture utilisée est une inspiration libre de la clean architecture (Voir aussi architecture Oignon et Hexagonale). Le concept n'est pas poussé à fond, pour une question de rapidité de mise en place et pour garder un maximum de souplesse en cas de changement radical du produit.

MongoDB a été choisi pour sa simplicité d'utilisation et de mise en place. L'architecture permettra de change de système de base de données ou d'utiliser un ORM.

Il est important de noter que chaque module ne peut communiquer avec un autre module SEULEMENT via le service de l'autre module. Il est préférable que chaque service qui est utilisé par un autre module décrive une interface (dans un fichier séparé) auquel le service répond. Ainsi si le service change il sera forcé de continuer à répondre à ce contrat avec les autres modules.

Il faut au maximum éviter l'inter-dépendance entre modules.

Le code de logique métier doit être uniquement écrit dans les services. C'est aux interfaces (HTTP, CLI…) de formater les données renvoyées par les services à leurs interlocuteurs. L'accès à la base de données doit se faire exclusivement dans les repositories pour faciliter le développement en cas de refactorisation.

## Setup

Pour utiliser l'api, vous devez au préalable avoir installé Node.js et NPM.

Vous devez ensuite installer les dépendances avec `npm install`.

Ensuite, il vous faudra créer un fichier .env à la racine du projet, avec au moins les variables d'environnement suivantes:

-   JWT_SECRET
-   MAIL_HOST
-   MAIL_PORT
-   MAIL_USER
-   MAIL_PASSWORD

Pour fonctionner l'api doit pouvoir se connecter à une base de données mongoDB v4.0 .  
Par défaut, elle se connecte à l'url `mongodb://localhost:27017/api-subventions-asso`.  
Il est possible de paramétrer ces informations dans le fichier .env. Le nom des variables se trouve dans `configurations/mongo.conf.ts`.

Vous pouvez utiliser docker pour simplifier l'installation de MongoDB avec les commandes suivantes :  
`sudo docker pull mongo:4.0.3`  
`sudo docker run -d -p 27017:27017 mongo`

## Démarrer l'api en local

1. Run `npm run dev`
2. Visit [http://localhost:8080](http://localhost:8080)

## Executer une commande CLI

1. Run `npm run cli [controller name] [method name] [...arguments]`

### Créer son utilisateur en local

1. Exécutez `npm run cli user create [your email]`.
2. Faites une requête HTTP POST `localhost:8080/auth/forget-password` avec comme corps `{ "email": [your email] }` pour générer un token de réinitialisation de mot de passe.
3. Allez dans la collection `user-reset` de mongodb user et copiez la valeur du token nouvellement généré.
4. Faites ensuite une requête HTTP POST `localhost:8080/auth/reset-password` avec comme corps `{ "password": [your new password], "token": [token from step 3] }` pour mettre à jour votre mot de passe.
5. Enfin, pour vous connecter, faite une requête HTTP POST `localhost:8080/auth/login` avec comme corps de requête `{ "email": [your email]}, "password": [password defined in step 4] }`

## Git

### MERGE vs REBASE

`rebase` la branche fille depuis la branche mère si cette dernière a été modifiée.
`merge` uniquement pour fusionner develop dans main et main dans PROD.
Les `hotfix` sont à merger sur la branche mère. Les branches filles doivent ensuite se `rebase` depuis leur branche mère pour récupérer la modification.

### Hooks

#### Commit

À chaque commit, un hook husky vérifie le nom du commit selon le [Conventionnal Commits](https://www.conventionalcommits.org/en/v1.0.0/).

Pour faire simple, chaque commit doit spécifier le ou les packages lerna ciblés par le développement ainsi qu'un mot clé identifiant la nature du développement (feature, refactoring, test, hotfix, etc).

Par exemple, un commit de feature classique sur l'API se nommera "feat(api): nouvelle fontionnalité".

#### Push

À chaque push, les tests unitaires sont exécutés. Le coverage est également mesuré, mais le seuil est pour l'instant désactivé car nous sommes en refactoring de tests (séparation unitaire - intégration).

### Branches

Chaque branche doit correspondre à un ticket issue du GitHub Project et inclure en début le numéro du ticket. Par exemple `123-new-dev-on-api` pour le ticket #123.

Par défaut, les développements se font sur la branche develop.

La branche main représente la pre-prod et la branche PROD l'environnement en production.

### CI

Chaque création de Pull-Request déclenche une série de commandes npm (build, lint, test) qui doivent toutes se terminer avec succès sans quoi la PR sera bloquée.

## Tests et Coverage

Les tests sont divisés en deux parties :

### Test unitaire

Les tests unitaires sont présents au plus proche du code testé. Leur nom doit se terminer par .unit.test `. C'est sur ces tests qu'est exécuté le coverage, qui a une tolérance de 85%. Un exemple type est présent dans `/src/example.unit.test `. Il montre l'utilisation, si possible, de deux constantes `actual`et`expected`qui sont ensuite comparées via`expect(actual).toEqual(expected)`. Cette façon de faire force les tests à être unitaires et atomiques, en ne testant qu'une seule chose à la fois et en rendant le test lisible et compréhensible.

Le coverage se teste avec la commande `npm run test:cov` qui parcours tous les fichiers `.unit.ts` présents dans `./src `. Pour avoir le coverage sur un seul fichier, et ainsi s'assurer qu'un nouveau développement est bien couvert de test, on exécute la commande `npm run test:unit [my-test-name].test -- --coverage --collectCoverageFrom=[relative/patch/to/my-test-name].ts`.

Format de test à suivre :

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

### Test d'intégration

Les tests d'intégration sont présents dans le dosser `test` à la racine du projet. Leur nom de fichier se termine par `spec.ts`. Ils ne doivent tester que les fonctionnalités de bout en bout. Comme les routes HTTP ou les CLI.

Pour ce faire, nous avons décidé d'utiliser le snapshot de Jest pour garder ces tests simples et concis. Dans l'exemple type d'un test d'intégration présent dans `/tests/example.spec.ts` on y voit l'utilisation de `.toMatchSnapshot()` qui crée un snapshot à la première exécution et qui valide le test. Il faut dans un premier temps s'assurer via un test manuel que la fonctionnalité fonctionne bien correctement. Les autres exécutions de `.toMatchSnapshot()` vont ensuite comparer le snapshot présent (et versionné sur Github) à celui re-généré. Si le nouveau snapshot ne "match" pas le premier, et que c'est lié à une modification de la fonctionnalité, il est nécessaire de mettre à jour le snapshot. Pour ce faire, il faut utiliser l'option `--updateSnapshot` (ou `-u`) de Jest. La commande pour mettre à jour tout un fichier de test est la suivante : `npm run test:integ -- -u nom-du-fichier.spec`. Mais il est également possible de mettre à jour tous les fichiers tests en même temps (`npm run test:integ -- -u`) ou de mettre à jour le snapshot d'un seul test (a.k.a `describe`) au sein d'un fichier (`npm run test:integ -- nom-du-fichier.spec -u -t test-name`).
