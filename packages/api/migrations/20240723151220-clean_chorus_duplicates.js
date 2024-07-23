module.exports = {
    async up(db) {
        const bulkWriteOps = [];

        // TODO extract _id list
        const aggregated = await db
            .collection("chorus-line")
            .aggregate(
                [
                    {
                        $match: {
                            "indexedInformations.dateOperation": {
                                $gte: new Date("2018-01-01T00:00:00.000Z"),
                                $lt: new Date("2019-01-01T00:00:00.000Z"),
                            },
                        },
                    },
                    {
                        $group:
                            /**
                             * _id: The id of the group.
                             * fieldN: The first field name.
                             */
                            {
                                _id: {
                                    siret: "$indexedInformations.siret",
                                    ej: "$indexedInformations.ej",
                                    date: "$indexedInformations.dateOperation",
                                    ccf: "$indexedInformations.centreFinancier",
                                    ca: "$indexedInformations.codeActivitee",
                                    cdf: "$indexedInformations.codeDomaineFonctionnel",
                                    ndp: {
                                        $let: {
                                            vars: {
                                                segments: {
                                                    $split: ["$indexedInformations.numeroDemandePayment", "/"],
                                                },
                                            },
                                            in: { $arrayElemAt: ["$$segments", -1] },
                                        },
                                    },
                                },
                                payments: { $addToSet: "$$ROOT" },
                                count: { $sum: 1 },
                            },
                    },
                    {
                        $match: { count: { $gt: 1 } },
                    },
                    {
                        $project: {
                            payment: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$payments",
                                            as: "payment",
                                            cond: {
                                                $eq: [
                                                    { $strLenCP: "$$payment.indexedInformations.numeroDemandePayment" },
                                                    22,
                                                ],
                                            },
                                        },
                                    },
                                    0,
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            paymentId: "$payment._id",
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            ids: { $push: "$paymentId" },
                        },
                    },
                ],
                { allowDiskUse: true },
            )
            .toArray();
        const idList = aggregated[0].ids;

        for (const _id of idList) {
            bulkWriteOps.push({
                deleteOne: { filter: { _id } },
            });
        }
        await db.collection("chorus-line").bulkWrite(bulkWriteOps);
    },

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    down() {},
};
