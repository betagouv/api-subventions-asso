# MinIO S3 Local

Mock S3 local pour le développement.

## Démarrage

- créer un fichier `.minio.env.local` à la racine du docker-compose.yml et y définir les variables d'environnement :
  - `MINIO_ROOT_USER`
  - `MINIO_ROOT_PASSWORD`

```bash
docker-compose up -d
```

## Accès

- **API S3**: http://localhost:9000
- **Console Web**: http://localhost:9001

## Création du bucket

### Via la console web

1. Se connecter 
2. créer un bucket `scdl-files`

## Connexion de l'api au s3

- - Pour permettre la connexion de l'api au s3, penser aussi à définir les variables d'environnement qui sont utilisée dans le fichier `api/src/configurations/s3.conf.ts`
    et notamment les variables `S3_ACCESS_KEY` et `S3_SECRET_KEY` avec les valeurs utilisateurs définies.

## Liste de commandes client MiniIo (mc)

- Lancer un shell dans le container : `docker exec -it <id_du_container> sh`
- Enregistrer l'url et les crendentials sous l'alias `local` : `mc alias set local http://127.0.0.1:9000 <user> <password>`
- Il est possible de générer d'autres utilisateurs et de définir leurs droits :
  - `mc admin user add local <user> <password>`
  - `mc admin policy attach local readwrite --user <user>`
- pour voir la liste des buckets : `mc ls local`
- pour créer un bucket : `mc mb local/<bucket_name>`
- pour upload un fichier : `mc cp <fichier_local> local/<bucket_name>/`
- pour download un fichier : `mc cp local/nom-du-bucket/fichier.txt ./fichier.txt`

