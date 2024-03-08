# Démarches Simplifiées

## Ajouter des démarches

1. Exécuter la requête Démarches Simplifiées sur postman avec la variables `demarcheId` correspondante.
2. Mettre au regard le retour de cet appel avec les dto d'arrivée `DemandeSubvention` et `ApplicationDto` 
3. Reprendre un schéma, par exemple `schema-base.json`
4. Le compléter avec les champs spécifiques de chaque démarche. 

## Format du schéma

Un schéma est construit ainsi 
```json
{
  "demarcheId": number,
  "commonSchema": [...],
  "schema": [...]
}
```

Au sein de chaque schéma, il faut un objet par champ à mapper. Certaines informations devront donc être mappés dans les deux attributs `schema` et `commonSchema`. Chaque objet de mapping peut avoir une des formes suivantes : 

```json
{
"from": chemin du champ côté démarche
"to": chemin du champ sur notre fromat
}
```
```json
{
"value": valeur directe pour toutes les demandes de la démarche
"to": chemin du champ sur notre fromat
}
```

Les chemins sont lus par la fonction `get` du module `lodash` (cf [docs](https://lodash.com/docs/4.17.15#get))

## Où trouver les informations

Les informations accessibles peuvent être à 3 niveaux dans la réponse Démarches Simplifiées. 
- dans les **champs et annotations** : auquel cas il faut bien reprendre dans l'attribut `from` le chemin complet en incluant l'identifiant technique du champ et le `.value`. *ex : `demande.champs.Q2hhbXAtMjM2MzQwMg==.value`*
- dans les **métadonnées de la réponse** : ce sont souvent (voir service instructeur) des informations faciles à récupérer et communes à toutes les démarches. *ex : `demandeur.siret`*
- dans les **métadonnées de la démarche** : pour l'instant seul le service est parfois utilisé comme service instructeur

## Règles métier 

### Service instructeur

On a défini avec Alexandra qu'il y a deux cas possibles pour ce champ. Ou bien 
1. Plusieurs groupes d'instructeurs sont définis et se répartissent les réponses. On trouve alors l'intitulé du service instructeur se trouve dans `demande.groupeInstructeur.label`
2. toutes les réponses sont instruites par les mêmes personnes. Auquel cas `demande.groupeInstructeur.label` n'est pas renseigné. On peut alors :
   - utiliser la métadonnée de démarche `service.nom`
   - inscrire en dur l'intitulé en concertation avec l'expertise métier, grâce au 2e type de format avec `value`

### Statut
Les statuts démarches simplifiées ne sont pour l'instant pas vraiment interprétés. On exclut simplement les demandes dont le statut est `en_construction` car elles correspondent à des brouillons

## Reste à faire
- définir la correspondance des statuts
- permettre d'avoir un schéma pour plusieurs démarches ou de faire hériter un schéma d'un autre
- avoir un système d'adaptateur défini par champ ?
- avoir un système de champ conditionnel ? On ne récupère pas de données contact qui existent parce qu'elles peuvent être dans des champs différents en fonction de la réponse à un troisième champ (la personne qui suit le dossier est-elle le responsable légal ou une tierce personne)

