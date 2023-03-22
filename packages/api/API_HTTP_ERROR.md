Ce fichier permet de centraliser la réflexion autour de la gestion des code et erreur HTTP retournés par l'API.

Il se base sur (cette page wiki)[https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_client_errors] mais tout autre ressource est bonne à rajouter pour affiner les choix.

Cette documentation n'est pas exhaustive car rédigée au fur et à mesure des cas rencontrés.

## CODES 4XX (CLIENT ERROR)

### 400 BadRequestError

Le code 400 est à retourner lorsque les informations présentes dans la requête (body/query) sont invalides (i.e role utilisateur inconnu, identifiant ne respectant pas le bon format, etc).

### 401 UnauthorizedError

Le code 401 est à retourner si l'utilisateur essaye d'accéder à une ressource protégée et n'est pas connecté (pas de `token` utilisateur) ou si la connexion à échouée.

### 403 ForbiddenError

Le code 403 est à retourner pour tout accès à une ressource dont l'utilisateur n'a pas les droits d'accès.

### 404 NotFoundError

Le code 404 est à retourner lorsque la ressource est introuvable. Que ce soit la ressource HTTP (i.e la route `/foo`) ou bien la ressource métier (i.e `/foo/{bar}` avec `bar` ne correspondant à rien en base de donnée).

### 409 ConflictError

Le code 409 est à retourner lorsque l'on essai d'ajouter une ressource mais qu'elle existe déjà (conflit avec l'état actuel du serveur).

### 500 InternalServerError

Le code 500 est à retourner si une erreur inconnue ou inattendue survient (i.e l'accès à la base de donnée à échouer)
