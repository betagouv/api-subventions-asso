# Comment télécharger et déployer les donnée osiris

## Télécharger

Exécuter le script `osiris-automation` du package tools
depuis le package tools, exécuter 
```bash
node osiris-automation/index.js [YEAR] [TYPE_DONNÉES]
```

Le script fonctionne en lançant un navigateur détaché. Il y a des bugs connus que voici comment contourner : 
- Si le script s'arrête en cours de route (l'affichage en console n'évolue plus pendant plusieurs dizaines de secondes), redémarrer le script. Il se relancera bien où vous en étiez
- Si le navigateur détaché est ouvert sur une page blanche, ouvrir un nouvel onglet dessus. Cela devrait débloquer la situation. 

**Dans ce script**, les valeurs possibles pour `TYPE_DONNÉES` sont `SuiviDossiers` et `SuiviActions`. Nous n'avons *pas* inclus de système pour télécharger automatiquement les évaluations.

Il faut donc l'exéctuer une fois pour les dossiers et une fois pour les actions. En fin d'année, penser à exécuter aussi l'année suivante pour attraper des cas de pluriannualité.

Les documents seront de multiples (nombreux !) fichiers excel, rangés dans le dossier `[package tools]/extract/[YEAR]/[TYPE_DONNÉES]/`

## Déployer les données
**Attention :** dans la partie déploiement, les types de données s'appellent  `requests`, `actions` et `evaluations`

| côté Téléchargement | côté Déploiement |
| -- | -- |
| SuiviDossiers | requests |
| SuiviActions | actions |
| / | evaluations |

Il faudra faire les opérations suivantes pour chaque type de donnée à déployer. Ce point ne sera pas précisé au sein de chaque niveau.

### Niveau 0 : en local

Exécuter depuis le package api 
```bash
npm run cli osiris parse [TYPE_DONNÉES] [CHEMIN_DES_FICHIERS] [YEAR]
```

Si vous ne les avez pas modifés, le chemin sera (depuis le package api) `../tools/extract/[YEAR]/[TYPE_DONNÉES_DL] [YEAR]`

### Niveau 1 : Laisser le script zipper et déployer
Vous pouvez exécuter **depuis le package api** : 
```bash
node tools/osiris/deploy-osiris-files.js [app scalingo] [type de données] [chemin vers les dossier des fichiers xls] [YEAR]
```

Le script devrait zipper les fichiers, split l'archive en morceau suffisamment petits, l'envoyer sur l'app scalingo, déployer tout ça et intégrer la donnée.

### Niveau 2 : Zipper soi-même et laisser le script déployer
1. Zipper les fichiers ensemble, puis séparer l'archive en plusieurs, de taille limitée
```bash
zip  [chemin archive pleine] [chemin des données sources]
zip [chemin archive pleine] --out [chemin archive split]/[type données]-split.zip -s 80m
```
Plusieurs documents seront vraisemblablement créés, donc prévoir un dossier pour recevoir l'archive splittée

**Attention :** Pour que le script suivant fonctionne, nommer l'archive splittée de la façon décrite (`[type données]-split.zip`) qui attend ce nom.
2. Puis exécuter **depuis le package api** : 
```bash
node tools/osiris/deploy-osiris-files.js [app scalingo] [type de données] [chemin vers les dossier des fichiers zippés] [YEAR] true
```

### Niveau 3 : Tout faire soi-même
1. Reprendre l'étape 1 du niveau 2 (mais vous pouvez nommer l'archive splittée comme vous voulez)
2. Se connecter sur scalingo à l'app voulue et en envoyant les fichiers. La commande aura la forme 
```bash
scalingo --app [APP_NAME] run --file [archive 1] --file [archive2]... --size XL bash
```

Depuis le container, 
1. créer un dossier dont vous aurez les droits, typiquement `/tmp/files`
2. copier les fichers d'archive zippé de là où ils sont arrivés `/tmp/uploads`
3. regrouper l'archive 
```bash
zip -s 0 [chemin vers le fichier principal de l\'achive splittée] --out [chemin archive regroupée]
```
4. dézipper l'archive
```bash
unzip [chemin archive regroupée] -d [dossier de sortie]
```
5. parser effectivement le fichier, presque comme dans le niveau 0, depuis le package api
```bash
node build/src/cli.js osiris parse [TYPE_DONNÉES] [CHEMIN_DES_FICHIERS]
```
