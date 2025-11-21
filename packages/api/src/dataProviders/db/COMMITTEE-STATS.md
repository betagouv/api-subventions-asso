# MONGODB QUERIES FOR REGULAR REQUESTS

## LISTS OF LOCAL OPERATORS SIRET

| Name                           | SIRET          |
| ------------------------------ | -------------- |
| ADEME                          | 38529030900454 |
| France Travail                 | 13000548119044 |
| IHEDN                          | 19754686400012 |
| GIP Les Entreprises s'Engagent | 19754686400012 |
| Agence du Service Civique      | 13001184400011 |
| Caisse des dépôts              | 18002002600019 |

## ALL € FROM LOCAL OPERATORS

From the `applications-flat` collection

```js
[
    {
        $match: {
            fournisseur: { $regex: /^scdl/ },
            idAttribuant: {
                $in: [
                    "38529030900454",
                    "13000548119044",
                    "19754686400012",
                    "13003019000016",
                    "13001184400011",
                    "18002002600019",
                ],
            },
            exerciceBudgetaire: { $in: [2023, 2024] },
        },
    },
    {
        $group: {
            _id: null,
            total: { $sum: "$montantAccorde" },
        },
    },
];
```

## ALL € FROM COLLECTIVITIES

From the `applications-flat` collection

```js
[
    {
        $match: {
            fournisseur: { $regex: /^scdl/ },
            idAttribuant: {
                $not: {
                    $in: [
                        "38529030900454",
                        "13000548119044",
                        "19754686400012",
                        "13003019000016",
                        "13001184400011",
                        "18002002600019",
                    ],
                },
            },
            exerciceBudgetaire: { $in: [2023, 2024] },
        },
    },
    {
        $group: {
            _id: null,
            total: { $sum: "$montantAccorde" },
        },
    },
];
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
