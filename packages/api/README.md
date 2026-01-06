# Data.Subvention API

## Choix technique et architecture

Le projet utilise la stack technique suivante :

- NodeJs
- Typescript
- Express
- MongoDB

L'architecture utilisée est une inspiration libre de la clean architecture (Voir aussi architecture Oignon et Hexagonale). Le concept n'est pas poussé à fond, pour une question de rapidité de mise en place et pour garder un maximum de souplesse en cas de changement radical du produit.

MongoDB a été choisi pour sa simplicité d'utilisation et de mise en place. L'architecture permettra de change de système de base de données ou d'utiliser un ORM.

Il est important de noter que chaque module ne peut communiquer avec un autre module SEULEMENT via le service de l'autre module. Il est préférable que chaque service qui est utilisé par un autre module décrive une interface (dans un fichier séparé) auquel le service répond. Ainsi si le service change il sera forcé de continuer à répondre à ce contrat avec les autres modules.

Il faut au maximum éviter l'inter-dépendance entre modules.

Le code de logique métier doit être uniquement écrit dans les services. C'est aux interfaces (HTTP, CLI…) de formater les données renvoyées par les services à leurs interlocuteurs. L'accès à la base de données doit se faire exclusivement dans les repositories pour faciliter le développement en cas de refactorisation.

## Setup

Pour utiliser l'api, vous devez au préalable avoir installé Node.js et PNPM.
Il faut d'abord activer Corepack, puis forcer l'utilisation de PNPM comme gestionnaire de librairie :

```bash
corepack enable
corepack prepare pnpm@10.24.0 --activate
 ```

Vous devez ensuite installer les dépendances avec `pnpm install`.

Ensuite, il vous faudra créer un fichier .env.local à la racine du projet api, avec au moins les variables d'environnement suivantes:

- JWT_SECRET
- MAIL_HOST
- MAIL_PORT
- MAIL_USER
- MAIL_PASSWORD

Les autres variables utilisées sont :

- API_ASSO_URL
- API_ASSO_TOKEN

Pour se connecter à l'API Association

- MONGO_DBNAME=datasubvention

Pour spécifier le nom de la base de donnée

- API_ENTREPRISE_TOKEN

Pour se connecter à l'API Entreprise

- API_BREVO_TOKEN
- API_BREVO_CONTACT_LIST

Pour utiliser les services Brevo (envoi de mail)

- DAUPHIN_USERNAME
- DAUPHIN_PASSWORD

Pour se connecter à DAUPHIN

- SENTRY_AUTH_TOKEN

Pour utiliser le reporting de bug Sentry

- DATA_BRETAGNE_USERNAME
- DATA_BRETAGNE_PASSWORD

Pour se connecter à l'API Data Bretagne

Pour fonctionner l'api doit pouvoir se connecter à une base de données mongoDB v4.0 .  
Par défaut, elle se connecte à l'url `mongodb://localhost:27017/api-subventions-asso`.  
Il est possible de paramétrer ces informations dans le fichier .env. Le nom des variables se trouve dans `configurations/mongo.conf.ts`.

Vous pouvez utiliser docker pour simplifier l'installation de MongoDB avec les commandes suivantes :  
`sudo docker run -d -p 27017:27017 mongo:4.0.3`

En partant d'une base de données vierge, il est nécessaire d'ajouter, en local, un nom de domaine accepté dans la collection `configurations` afin de permettre la création d'un utilisateur :
`db.configurations.insertOne({name: "ACCEPTED-EMAIL-DOMAINS", data: ["beta.gouv.fr"]})`

Pour build l'api il est nécessaire au préalable de build le dossier dto pour avoir accès au types. Pour ce faire executer un `pnpm build:api` depuis la racine `/api-subventions-asso`.

### Pour AgentConnect

AgentConnect ne fonctionne pas avec l'url `localhost`. Pour qu'AgentConnect fonctionne, il faut

1. définir les variables d'environnements
    - AGENT_CONNECT_ENABLED -> `true`
    - AGENT_CONNECT_CLIENT_ID
    - AGENT_CONNECT_CLIENT_SECRET
    - AGENT_CONNECT_URL : https://fca.integ01.dev-agentconnect.fr/api/v2 en local et préprod
2. mettre en place un alias qui redirige `dev.local` vers `localhost`. Pour cela, ajouter au fichier `/etc/hosts` la ligne
    ```
    127.0.0.1 dev.local
    ```
    Dans l'absolu il faut que l'alias corresponde à ce qui a été renseigné lors de la demande des client_id et client_secret utilisés.

## Démarrer l'api en local

1. Run `pnpm dev`
2. Visit [http://dev.local:8080](http://dev.local:8080)

## Exécuter une commande CLI

1. Run `pnpm cli [controller name] [method name] [...arguments]`

### Créer son utilisateur en local

1. Exécutez `pnpm cli user create [your email]`.
2. Faites une requête HTTP POST `dev.local:8080/auth/forget-password` avec comme corps `{ "email": [your email] }` pour générer un token de réinitialisation de mot de passe.
3. Allez dans la collection `user-reset` de mongodb user et copiez la valeur du token nouvellement généré.
4. Faites ensuite une requête HTTP POST `dev.local:8080/auth/reset-password` avec comme corps `{ "password": [your new password], "token": [token from step 3] }` pour mettre à jour votre mot de passe.
5. Enfin, pour vous connecter, faite une requête HTTP POST `dev.local:8080/auth/login` avec comme corps de requête `{ "email": [your email]}, "password": [password defined in step 4] }`

## Mettre en place une tâche récurrente

Les tâches récurrentes se basent sur le module [toad-scheduler](https://github.com/kibertoad/toad-scheduler). Il existe deux types de façon de programmer les tâches :

- par un intervalle (_ex_ : `{ minutes: 3 }`"toutes le 3 minutes")
- par une expression cron (_ex_ : `"0 0 1 * *"` tous les premiers du mois)

Pour ajouter une tâche récurrente, il faut :

1. Créer un contrôleur `src/modules/[nom-module]/interfaces/cron/[controller-namer].cron.controller.ts` sur le modèle du fichier `example.cron.controller.ts`. Le contrôleur doit exporter une classe avec
    - un attribut `name` qui l'identifie
    - autant de méthodes que de tâches. Ces méthodes devront être munies d'un décorateur parmi
        - `Cron`
        - `AsyncCron`
        - `Cron`
        - `AsyncIntervalCron`
          en fonction de si la tâche est asynchrone ou non et du type de programmation donnée. Le décorateur prend deux attributs :
        - la programmation de la tâche (intervalle ou expression cron)
        - dans le cas `Interval` : un booléen indiquant si cet intervalle est "long" ou non, c'est-à-dire s'il fait + de 24,85 jours. Ce critère qui semble arbitraire permet d'arbitrer entre deux objets techniques différents pour éviter un problème potentiel d'overflow d'entier.
2. Enregistrer le contrôleur dans `src/cron.ts`

### En cas d'erreur

Un message mattermost est envoyé automatiquement, avec la stacktrace en détail (cliquer sur le `i` à droite du nom d'utilisateur)

### Option `runImmediately` de l'intervalle

Le paramètre `schedule` des contrôleurs supporte un attribut qui précise si la tâche doit se lancer une première fois au lancement de l'application ou non. Contrairement au comportement par défaut du module, ce paramètre est activé par défaut.
Attention, s'il est désactivé, l'intervalle sera réinitialisé à chaque redémarrage de l'application (donc au moins à chaque mise en prod et crash de l'api)

## Conventions de Code
### Guide de conventions de nommage

Voici des conventions claires et robustes pour nommer fichiers, dossiers, classes, interfaces et types dans ce projet.

#### Dossiers

- Toujours en **kebab-case** (tout en minuscule, tirets pour séparer les mots). Exple: `open-source`

#### Fichiers

Format général :
- **kebab-case + suffixe explicite**
- Pas de majuscules ou underscores

| Type de fichier | Suffixe recommandé | Exemple |
|----------------|------------------|----------------------|
| Controller     | `.controller.ts` | `user.controller.ts` |
| Service        | `.service.ts`    | `auth.service.ts`    |
| Routes         | `.routes.ts`     | `user.routes.ts`     |
| Middleware     | `.middleware.ts` | `auth.middleware.ts` |
| DTO            | `.dto.ts`        | `create-user.dto.ts` |
| Validator      | `.validator.ts`  | `user.validator.ts`  |
| Mapper         | `.mapper.ts`     | `user.mapper.ts`     |
| Utils          | `.utils.ts`      | `date.utils.ts`      |
| Config         | `.config.ts`     | `database.config.ts` |
| Types          | `.types.ts`      | `user.types.ts`      |
| Interface      | `.interface.ts`  | `user.interface.ts`  |
| Enum           | `.enum.ts`       | `user-role.enum.ts`  |

 Le suffixe décrit le **rôle** du fichier, pas uniquement son contenu.

#### Classes, Interfaces et Types

- **Classes / Interfaces / Types** → PascalCase

```ts
// user-service.ts
export class UserService {}

// create-user.dto.ts
export class CreateUserDto {}
```

### API

Le format des attributs de l'API est le snake_case.

L'API retourne des données identifiées en français. Les attributs JSON seront donc écrits en français pour faciliter la compréhension des utilisateurs. Il en va de même pour le nom des ressources HTTP.

On préférera donc `/utilisateur` à `/user` et `{ etablissement: [] }` à `establishment: []`.

### Code Source

Le format camelCase doit être utilisé pour toute définition de variable dans le code.

La totalité du code source doit être en anglais. La création de variables à partir de retour de l'API devra se traduire en anglais.

Exemple : `const establishment = association.etablissement // retour API en français mais variable en anglais `

## Git

### MERGE vs REBASE

`rebase` uniquement dans des branches qui n'ont pas encore été mergées dans aucune des trois branches `develop`, `main` ni `PROD`
`merge` pour fusionner `develop` dans `main` et `main` dans `PROD` mais aussi pour les `hotfix`. Dans le cas de branches filles vers branche mère, penser à utiliser l'option git `--ff-only` pour mettre en lumière des potentielles incohérences d'historique.
Les `hotfix` sont à merger sur la branche mère `PROD` ou `main`. Il faut esnuite merge successivement des branches mères vers les branches filles (`PROD` vers `main` puis `main` vers `dev`)

### Hooks

#### Commit

À chaque commit, un hook husky vérifie le nom du commit selon le [Conventionnal Commits](https://www.conventionalcommits.org/en/v1.0.0/).

Pour faire simple, chaque commit doit spécifier le ou les packages lerna ciblés par le développement ainsi qu'un mot clé identifiant la nature du développement (feature, refactoring, test, hotfix, etc).

Par exemple, un commit de feature classique sur l'API se nommera "feat(api): nouvelle fonctionnalité".

#### Push

À chaque push, les tests unitaires sont exécutés. Le coverage est également mesuré, mais le seuil est pour l'instant désactivé car nous sommes en refactoring de tests (séparation unitaire - intégration).

### Branches

Chaque branche doit correspondre à un ticket issue du GitHub Project et inclure en début le numéro du ticket. Par exemple `123-new-dev-on-api` pour le ticket #123.

Par défaut, les développements se font sur la branche develop.

La branche main représente la pre-prod et la branche PROD l'environnement en production.

### CI

Chaque création de Pull-Request déclenche une série de commandes pnpm (build, lint, test) qui doivent toutes se terminer avec succès sans quoi la PR sera bloquée.

## Tests et Coverage

Les tests sont divisés en deux parties :

### Test unitaire

Les tests unitaires sont présents au plus proche du code testé. Leur nom doit se terminer par `.test.ts`. C'est sur ces tests qu'est exécuté le coverage, qui a une tolérance de 85%. Un exemple type est présent dans `/src/example.test.ts`. Il montre l'utilisation, si possible, de deux constantes `actual` et `expected` qui sont ensuite comparées via `expect(actual).toEqual(expected)`. Cette façon de faire force les tests à être unitaires et atomiques, en ne testant qu'une seule chose à la fois et en rendant le test lisible et compréhensible.

Le coverage se teste avec la commande `pnpm test:cov` qui parcours tous les fichiers `.test.ts` présents dans `./src `. Pour avoir le coverage sur un seul fichier, et ainsi s'assurer qu'un nouveau développement est bien couvert de test, on exécute la commande `pnpm test:unit [my-test-name].test -- --coverage --collectCoverageFrom=[relative/patch/to/my-test-name].ts`.

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

Pour ce faire, nous avons décidé d'utiliser le snapshot de Jest pour garder ces tests simples et concis. Dans l'exemple type d'un test d'intégration présent dans `/tests/example.spec.ts` on y voit l'utilisation de `.toMatchSnapshot()` qui crée un snapshot à la première exécution et qui valide le test. Il faut dans un premier temps s'assurer via un test manuel que la fonctionnalité fonctionne bien correctement. Les autres exécutions de `.toMatchSnapshot()` vont ensuite comparer le snapshot présent (et versionné sur Github) à celui re-généré. Si le nouveau snapshot ne "match" pas le premier, et que c'est lié à une modification de la fonctionnalité, il est nécessaire de mettre à jour le snapshot. Pour ce faire, il faut utiliser l'option `--updateSnapshot` (ou `-u`) de Jest. La commande pour mettre à jour tout un fichier de test est la suivante : `pnpm test:integ -- -u nom-du-fichier.spec`. Mais il est également possible de mettre à jour tous les fichiers tests en même temps (`pnpm test:integ -- -u`) ou de mettre à jour le snapshot d'un seul test (a.k.a `describe`) au sein d'un fichier (`pnpm test:integ -- nom-du-fichier.spec -u -t test-name`).

### Package UNIX nécessaire

- zip
- tar
