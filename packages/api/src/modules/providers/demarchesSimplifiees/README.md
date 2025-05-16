## cli `generateSchema`

Les `schemasSeed` sont lus à partir d'un fichier au format JSON. Les éléments individuels sont formés des attributs
- `to` obligatoire qui indique où amener l'information


- `from` si l'information varie à chaque demande mais que l'endroit où la récupérer est statique à l'échelle du modèle. Typiquement pour des champs lié au format de démarches DS
- `possibleLabels` est un tableau listant les libellés des champs ou annotations dont il faut connaître l'identifiant pour savoir où chercher l'information
- `valueToPrompt: true` pour faire rentrer à la personne qui lance le cli si elle change à chaque formulaire et ne se déduit pas du contenu de la démarche. Si on valide sans rien entrer, on considèrera que la valeur n'est pas remplie, et non pas remplie avec la valeur ""
- `value` si une valeur est définissable à l'échelle de tous les formulaires du modèle. Ce sera considéré comme une valeur par défaut et une confirmation ou variation sera demandé à la personne qui lance le cli. 

Ces différentes façons de récupérer l'information sont prises en compte dans l'ordre indiqué. Par exemple, si `possibleLabels` et `value` sont renseignés, `value` ne sera pris en compte que si aucun label de `possibleLabels` n'a été trouvé dans les champs ou les annotations.

La méthode du cli vient avec l'option `testDev`. Si celle-ci est activé, le schéma ne sera pas enregistré mais seulement écrit dans un fichier json à la racine du package `api`.
