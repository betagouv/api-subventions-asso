Ce fichier permet de centraliser la réflexion autour de la gestion des code et erreur HTTP retournés par l'API.

Il se base sur (cette page wiki)[https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_client_errors] mais tout autre ressource est bonne à rajouter pour affiner les choix.

Cette documentation n'est pas exhaustive car rédigée au fur et à mesure des cas rencontrés.

## CODES 4XX (CLIENT ERROR)

### 400
Le code erreur 400 est à retourner lorsque les informations présentes dans la requête (body/query) sont invalide (i.e role utilisateur inconnu, identifiant ne respectant pas le bon format, etc).

### 422
Le code erreur 422 est à retourner lorsque la requête est valide mais que l'entité recherchée n'existe pas en base (i.e email ne retournant aucun utilisateur, identifiant ne retournant aucune association).