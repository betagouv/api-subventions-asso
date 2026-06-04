# MONGODB QUERIES FOR REGULAR REQUESTS

## LISTS OF LOCAL OPERATORS SIRET

| Name                           | SIRET          |
| ------------------------------ | -------------- |
| ADEME                          | 38529030900454 |
| France Travail                 | 13000548113153 |
| France Travail                 | 13000548121040 |
| France Travail                 | 13000548112007 |
| France Travail                 | 13000548116917 |
| France Travail                 | 13000548121115 |
| France Travail                 | 13000548118277 |
| France Travail                 | 13000548117501 |
| France Travail                 | 13000548119044 |
| France Travail                 | 13000548117345 |
| France Travail                 | 13000548119424 |
| France Travail                 | 13000548119820 |
| France Travail                 | 13000548100010 |
| IHEDN                          | 19754686400012 |
| GIP Les Entreprises s'Engagent | 13003019000016 |
| Agence du Service Civique      | 13001184400011 |
| Caisse des dépôts              | 18002002600019 |
| OFB                            | 13002591900015 |

## Montants en €

### Collectivités

Collection : `applications-flat`

Montants des collectivités SCDL excluant les opérateurs

```js
[
  {
    $match: {
      exerciceBudgetaire: { $in: [2023, 2024, 2025] },
      statutLabel: "Accordé",
      idAttribuant: {
        $nin: [
          "38529030900454",
          "13002233800011",
          "19754686400012",
          "13003019000016",
          "13000548113153",
          "13000548121040",
          "13000548112007",
          "13000548116917",
          "13000548121115",
          "13000548118277",
          "13000548117501",
          "13000548119044",
          "13000548117345",
          "13000548119424",
          "13000548119820",
          "13000548100010",
          "13001184400011",
          "18002002600019",
          "13002591900015"
        ]
      },
      fournisseur: {
        $regex: /^scdl-/,
        $nin: [
          "scdl-38529030900454",
          "scdl-13002233800011",
          "scdl-19754686400012",
          "scdl-13003019000016",
          "scdl-13000548113153",
          "scdl-13000548121040",
          "scdl-13000548112007",
          "scdl-13000548116917",
          "scdl-13000548121115",
          "scdl-13000548118277",
          "scdl-13000548117501",
          "scdl-13000548119044",
          "scdl-13000548117345",
          "scdl-13000548119424",
          "scdl-13000548119820",
          "scdl-13000548100010",
          "scdl-13001184400011",
          "scdl-18002002600019",
          "scdl-13002591900015"
        ]
      }
    }
  },
  {
    $lookup: {
      from: "rna-siren",
      localField: "idEntrepriseBeneficiaire",
      foreignField: "siren",
      as: "__association_match"
    }
  },
  {
    $match: {
      "__association_match.0": { $exists: true }
    }
  },
  {
    $unset: "__association_match"
  },
  {
    $group: {
      _id: "$exerciceBudgetaire",
      amount_eur: { $sum: "$montantAccorde" },
      grants_count: { $sum: 1 },
      scdl_sources: { $addToSet: "$fournisseur" }
    }
  },
  {
    $project: {
      _id: 0,
      year: "$_id",
      amount_eur: 1,
      grants_count: 1,
      scdl_sources_count: { $size: "$scdl_sources" }
    }
  }
]
```

### Opérateurs

Collection : `applications-flat`

Une ligne par année et par opérateur

```js
[
  {
    $match: {
      exerciceBudgetaire: { $in: [2023, 2024, 2025] },
      statutLabel: "Accordé",
      $or: [
        {
          fournisseur: {
            $in: [
              "scdl-38529030900454",
              "scdl-13002233800011",
              "scdl-19754686400012",
              "scdl-13003019000016",
              "scdl-13000548113153",
              "scdl-13000548121040",
              "scdl-13000548112007",
              "scdl-13000548116917",
              "scdl-13000548121115",
              "scdl-13000548118277",
              "scdl-13000548117501",
              "scdl-13000548119044",
              "scdl-13000548117345",
              "scdl-13000548119424",
              "scdl-13000548119820",
              "scdl-13000548100010",
              "scdl-13001184400011",
              "scdl-18002002600019",
              "scdl-13002591900015"
            ]
          },
          idAttribuant: {
            $in: [
              "38529030900454",
              "13002233800011",
              "19754686400012",
              "13003019000016",
              "13000548113153",
              "13000548121040",
              "13000548112007",
              "13000548116917",
              "13000548121115",
              "13000548118277",
              "13000548117501",
              "13000548119044",
              "13000548117345",
              "13000548119424",
              "13000548119820",
              "13000548100010",
              "13001184400011",
              "18002002600019",
              "13002591900015"
            ]
          }
        },
        { fournisseur: "fonjep" },
        { fournisseur: "osiris", dispositif: { $regex: /^ANS/i } }
      ]
    }
  },
  {
    $lookup: {
      from: "rna-siren",
      localField: "idEntrepriseBeneficiaire",
      foreignField: "siren",
      as: "__association_match"
    }
  },
  {
    $match: {
      "__association_match.0": { $exists: true }
    }
  },
  {
    $unset: "__association_match"
  },
  {
    $addFields: {
      operator_name: {
        $switch: {
          branches: [
            { case: { $eq: ["$fournisseur", "fonjep"] }, then: "FONJEP" },
            {
              case: {
                $and: [
                  { $eq: ["$fournisseur", "osiris"] },
                  { $regexMatch: { input: "$dispositif", regex: /^ANS/i } }
                ]
              },
              then: "ANS"
            },
            { case: { $eq: ["$idAttribuant", "38529030900454"] }, then: "ADEME" },
            { case: { $eq: ["$idAttribuant", "13002233800011"] }, then: "Santé Publique France" },
            { case: { $eq: ["$idAttribuant", "19754686400012"] }, then: "IHEDN" },
            { case: { $eq: ["$idAttribuant", "13003019000016"] }, then: "GIP Les entreprises s'engagent" },
            { case: { $eq: ["$idAttribuant", "13001184400011"] }, then: "Agence du Service Civique" },
            { case: { $eq: ["$idAttribuant", "18002002600019"] }, then: "Caisse des dépôts" },
            { case: { $eq: ["$idAttribuant", "13002591900015"] }, then: "OFB" },
            {
              case: {
                $in: [
                  "$idAttribuant",
                  [
                    "13000548113153",
                    "13000548121040",
                    "13000548112007",
                    "13000548116917",
                    "13000548121115",
                    "13000548118277",
                    "13000548117501",
                    "13000548119044",
                    "13000548117345",
                    "13000548119424",
                    "13000548119820",
                    "13000548100010"
                  ]
                ]
              },
              then: "France Travail"
            }
          ],
          default: "Autre"
        }
      },
      operator_type: {
        $cond: [
          { $in: ["$fournisseur", ["fonjep", "osiris"]] },
          "hors SCDL",
          "SCDL"
        ]
      },
      source: {
        $switch: {
          branches: [
            { case: { $eq: ["$fournisseur", "fonjep"] }, then: "fonjep" },
            { case: { $eq: ["$fournisseur", "osiris"] }, then: "osiris-ans" }
          ],
          default: "scdl"
        }
      }
    }
  },
  {
    $match: {
      operator_name: { $ne: "Autre" }
    }
  },
  {
    $group: {
      _id: {
        year: "$exerciceBudgetaire",
        operator_type: "$operator_type",
        operator_name: "$operator_name",
        source: "$source"
      },
      amount_eur: { $sum: "$montantAccorde" },
      grants_count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      year: "$_id.year",
      operator_type: "$_id.operator_type",
      operator_name: "$_id.operator_name",
      source: "$_id.source",
      amount_eur: 1,
      grants_count: 1
    }
  }
]
```

Pour obtenir les sous-totaux par année, remplacer la partie finale à partir du `$group` par :

```js
{
  $group: {
    _id: "$exerciceBudgetaire",
    amount_eur: { $sum: "$montantAccorde" },
    grants_count: { $sum: 1 }
  }
},
{
  $project: {
    _id: 0,
    year: "$_id",
    amount_eur: 1,
    grants_count: 1
  }
}
```

## Sources de données

Collection : `applications-flat`

Compte les fournisseurs distincts qui ont des subventions sur chaque exercice, chaque fournisseur SCDL `scdl-<SIRET>` compte donc comme une source

```js
[
  {
    $match: {
      exerciceBudgetaire: { $in: [2023, 2024, 2025] },
      montantAccorde: { $gt: 0 },
      fournisseur: { $ne: null }
    }
  },
  {
    $group: {
      _id: "$exerciceBudgetaire",
      sources: { $addToSet: "$fournisseur" }
    }
  },
  {
    $project: {
      _id: 0,
      year: "$_id",
      sources_count: { $size: "$sources" }
    }
  }
]
```

## Jeux de données SCDL importés

Collection : `data-log`

Compte les imports dont `providerId` est un SIRET, par année d'intégration

```js
[
  {
    $match: {
      integrationDate: {
        $gte: new Date("2023-01-01T00:00:00.000Z"),
        $lt: new Date("2026-01-01T00:00:00.000Z")
      },
      providerId: { $regex: /^\d{14}$/ }
    }
  },
  {
    $project: {
      year: { $year: "$integrationDate" },
      providerId: "$providerId"
    }
  },
  {
    $match: {
      year: { $in: [2023, 2024, 2025] }
    }
  },
  {
    $group: {
      _id: "$year",
      imports_count: { $sum: 1 },
      scdl_sources: { $addToSet: "$providerId" }
    }
  },
  {
    $project: {
      _id: 0,
      year: "$_id",
      imports_count: 1,
      scdl_sources_count: { $size: "$scdl_sources" }
    }
  }
]
```

## NB OF PROVIDERS

From the `data-log` collection :

```js
[
    {
        $group:
            /**
             * _id: The id of the group.
             * fieldN: The first field name.
             */
            {
                _id: "$providerId",
            },
    },
    {
        $count:
            /**
             * Provide the field name for the count.
             */
            "nbProviders",
    },
];
```

## NB OF CONSUMMERS

From the `users` collection

```js
find({ roles: "consumer" });
```

## LIST OF ENTRYPOINT OF INTEREST

["association", "etablissement", "document", "open-data/subventions", "open-data", "search"]

## NB OF REQUESTS FROM GIVEN YEAR GROUP BY MONTH

From the log collection

```js
[
    { $match: { timestamp: { $gte: new Date("2024-01-01"), $lt: new Date("2025-01-01") } } },
    {
        $match:
            /**
             * query: The query in MQL.
             */

            { "meta.req.url": /^\/search/ }, // type of request from list of entry points above
    },
    {
        $group: {
            _id: { $month: "$timestamp" },
            requests: { $sum: 1 },
        },
    },
];
```

## SCDL ONLY ASSO (do not keep operators)

```js
[
    { $match: { timestamp: { $gte: new Date("2024-01-01"), $lt: new Date("2025-01-01") } } },
    {
        $match: { exercice: 2023 },
    },
    {
        $lookup: {
            from: "sirene",
            let: { associationSiren: { $substr: ["$associationSiret", 0, 9] } },
            pipeline: [{ $match: { $expr: { $eq: ["$$associationSiren", "$siren"] } } }, { $limit: 1 }],
            as: "sirene",
        },
    },
    {
        $unwind: {
            path: "$sirene",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $match: { sirene: { $ne: null } },
    },
];
```

## STATS CONSOMMATION API

```js
[
    {
        $match: {
            timestamp: {
                $gte: new Date("2024-01-01"),
                $lt: new Date("2025-01-01"),
            },
        },
    },
    {
        $match: {
            "meta.req.url": /^\/association|\/etablissement/,
            "meta.req.user._id": { $ne: null, $exists: true },
        },
    },
    {
        $group: {
            _id: "$meta.req.user._id",
            requests: { $push: "$$ROOT.meta.req.url" },
            size: { $sum: 1 },
        },
    },
];
```
