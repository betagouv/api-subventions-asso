# Démarches Simplifiées

## Ajouter des démarches

1. Exécuter la requête Démarches Simplifiées sur postman avec la variables `demarcheId` correspondante.
2. Mettre au regard le retour de cet appel avec les dto d'arrivée `DemandeSubvention`, `CommonApplicationDto` et `ApplicationFlatEntity`
3. Reprendre un schéma, par exemple `schema-base.json` qui reprend les champs systématiques liés au système informatique de démarches simplifiées.
4. Le compléter avec les champs spécifiques de chaque démarche.

## Format du schéma

Un schéma est construit ainsi

```json
{
  "demarcheId": number,
  "commonSchema": [...],
  "schema": [...],
  "flatSchema": [...]
}
```

Au sein de chaque schéma, il faut un objet par champ à mapper. Certaines informations devront donc être mappées dans les trois attributs `schema`, `commonSchema` et `flatSchema`. Chaque objet de mapping peut avoir une des formes suivantes :

```json
{
    "from": chemin du champ côté démarche
    "to": chemin du champ sur notre format
}
```

```json
{
    "value": valeur directe pour toutes les demandes de la démarche
    "to": chemin du champ sur notre format
}
```

Les chemins sont lus par la fonction `get` du module `lodash` (cf [docs](https://lodash.com/docs/4.17.15#get))

## Où trouver les informations

Les informations accessibles peuvent être à 3 niveaux dans la réponse Démarches Simplifiées.

- dans les **champs et annotations** : auquel cas il faut bien reprendre dans l'attribut `from` le chemin complet en incluant l'identifiant technique du champ et le `.value`. _ex : `demande.champs.Q2hhbXAtMjM2MzQwMg==.value`_
- dans les **métadonnées de la réponse** : ce sont souvent (voir service instructeur) des informations faciles à récupérer et communes à toutes les démarches. _ex : `demandeur.siret`_
- dans les **métadonnées de la démarche** : pour l'instant seul le service est parfois utilisé comme service instructeur

## Générateur de schéma à partir d'une seed

Plusieurs démarches suivent en réalité la même forme, sont dupliquées les unes à partir des autres etc. Pour simplifier l'intégration, on décrit ces points communs dans une "seed". Ensuite, pour chaque nouvelle démarche qui ressemble assez, on peut utiliser la commande :

```bash
pnpm cli generateSchema <path_to_seed> <id_demarche> <testDev>
```

qui ajoute en base de données le schéma généré pour la démarche sélectionnée. En particulier, les identifiants techniques des champs et annotations seront trouvés à partir de leurs libellés. Ce système fonctionne donc si les noms de champs restent stables.

Pour s'assurer que le mapping est bon, le dernier argument (facultatif) permet de générer le schéma en local pour le relire. Cette option s'active s'il est utilisé, quelle qu'en soit la valeur.

Les `schemasSeed` sont lus à partir d'un fichier au format JSON. Les éléments individuels sont formés des attributs

- `to` obligatoire qui indique où amener l'information
- `from` si l'information varie à chaque demande mais que l'endroit où la récupérer est statique à l'échelle du modèle.
  Typiquement pour des champs lié au format de démarches DS
- `possibleLabels` est un tableau listant les libellés des champs ou annotations dont il faut connaître l'identifiant pour savoir où chercher l'information
- `valueToPrompt: true` pour faire rentrer à la personne qui lance le cli si elle change à chaque formulaire et ne se déduit pas du contenu de la démarche. Si on valide sans rien entrer, on considèrera que la valeur n'est pas remplie, et non pas remplie avec la valeur ""
- `value` si une valeur est définissable à l'échelle de tous les formulaires du modèle. Ce sera considéré comme une valeur par défaut et une confirmation ou variation sera demandée à la personne qui lance le cli.

Ces différentes façons de récupérer l'information sont prises en compte dans l'ordre indiqué. Par exemple, si `possibleLabels` et `value` sont renseignés, `value` ne sera pris en compte que si aucun label de `possibleLabels` n'a été trouvé dans les champs ou les annotations.

> [!NOTE]
> Cas typique : Le premier seed utilisé correspond aux différentes démarches du Ministère de la Culture et couvre les
> démarches n° 62744, 62746, 62747, 74747, 78102, 78125, 78126, 78128, 86113. À date du 27/08/2025 les seules autres
> démarches sont donc 72319, 73407 et 79485.

## Règles métier

### Service instructeur

On a défini avec Alexandra qu'il y a deux cas possibles pour ce champ. Ou bien :

1. Plusieurs groupes d'instructeurs sont définis et se répartissent les réponses. On trouve alors l'intitulé du service instructeur se trouve dans `demande.groupeInstructeur.label`
2. toutes les réponses sont instruites par les mêmes personnes. Auquel cas `demande.groupeInstructeur.label` n'est pas renseigné. On peut alors :
    - utiliser la métadonnée de démarche `service.nom`
    - inscrire en dur l'intitulé en concertation avec l'expertise métier, grâce au 2e type de format avec `value`

### Statut

Les statuts de démarches simplifiées viennent du système lui-même (ni des champs ni des annotations). Cependant, on ne peut pas être sûrs que les instructeurs utilisent cette fonctionnalité de manière homogène. Notamment, on ne sait pas si la sortie du statut "en instruction" est bien maintenue à jour. On a toutefois produit une correspondance :

| statut côté Démarches Simplifiées | statut côté data.subv |
| --------------------------------- | --------------------- |
| refuse                            | REFUSED               |
| accepte                           | GRANTED               |
| sans_suite                        | INELIGIBLE            |
| en_instruction                    | PENDING               |
| en_construction                   | ✖️                    |

> [!NOTE]
> Les démarches "en_construction" sont simplement ignorées car les demandes n'ont pas encore été déposées/terminées par les associations

## Les démarches déjà enregistrées via une seed

/ signifie de ne rien rentrer pour cette question. Ça prend alors la valeur par défaut ou acte qu'on sait pas

### conformément au schemaSeed `ministereCulture.json`

| demarcheId | service_instructeur | exercice / budgetaryYear                | commentaire                                                                                                                                              |
| ---------- | ------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 62744      | /                   | 2023                                    |                                                                                                                                                          |
| 62746      | /                   | 2023                                    |                                                                                                                                                          |
| 62747      | /                   | 2023                                    |                                                                                                                                                          |
| 75747      | /                   |                                         | ne contient pas d'exercice à strictement parler donc sera bloquant pour applicationFlat (on prend depuis un champ alernatif on n'a pas tout à fait rien) |
| 78102      | /                   | 2024                                    |                                                                                                                                                          |
| 78125      | /                   | 2024                                    |                                                                                                                                                          |
| 78126      | /                   | 2024                                    |                                                                                                                                                          |
| 78128      | /                   | 2024                                    |                                                                                                                                                          |
| 86113      | /                   | 2024                                    |                                                                                                                                                          |
| 98722      | /                   | correspond à un champ mappé par le seed |                                                                                                                                                          |
| 98775      | /                   | correspond à un champ mappé par le seed |                                                                                                                                                          |
| 98744      | /                   | correspond à un champ mappé par le seed |                                                                                                                                                          |
| 91587      | /                   | correspond à un champ mappé par le seed |                                                                                                                                                          |

## Les démarches avec leur schéma spécifique

- 73407
- 72319
- 79485

## Reste à faire

### défini

- [ ] retirer les schémas `commonSchema` et `schema` quand les formats associés `commonGrant` et `DemandeSubvention` auront été dépréciés
- [ ] préciser les mapping sur service_instructeur vs attribuant
- [ ] intégrer la démarche [106489 du ministère de la culture](https://github.com/betagouv/api-subventions-asso/issues/3448) . Il devrait correspondre au schéma mais on attend que soit ils nous donne un exercice global pour la démarche soit qu'ils aient ajouté un champ pour signifier l'exercice demande par demande (voir avec Sydney). Dans ce dernier cas, si le libellé ne correspond pas exactement au seed on pourra amender le seed.

### Hypothétique

- [ ] avoir un système d'adaptateur défini par champ ?
- [ ] avoir un système de champ conditionnel ? On ne récupère pas de données contact qui existent parce qu'elles peuvent être dans des champs différents en fonction de la réponse à un troisième champ (la personne qui suit le dossier est-elle le responsable légal ou une tierce personne)
