const dauphinService = require("../build/src/modules/providers/dauphin-gispro/dauphin.service").default;
const dsService = require("../build/src/modules/providers/demarchesSimplifiees/demarchesSimplifiees.service").default;
const dataBretagneService = require("../build/src/modules/providers/dataBretagne/dataBretagne.service").default;
const gisproService = require("../build/src/modules/providers/dauphin-gispro/gispro.service").default;
const fonjepService = require("../build/src/modules/providers/fonjep/fonjep.service").default;
const osirisService = require("../build/src/modules/providers/osiris/osiris.service").default;
const chorusService = require("../build/src/modules/providers/chorus/chorus.service").default;
const subventiaService = require("../build/src/modules/providers/subventia/subventia.service").default;

module.exports = {
    async up(db) {
        const DATA_LOG_COLLECTION = "data-log";

        await db
            .collection(DATA_LOG_COLLECTION)
            .updateMany({ providerId: dauphinService.meta.id }, { $set: { providerName: dauphinService.meta.name } });

        await db
            .collection(DATA_LOG_COLLECTION)
            .updateMany({ providerId: gisproService.meta.id }, { $set: { providerName: gisproService.meta.name } });

        await db
            .collection(DATA_LOG_COLLECTION)
            .updateMany({ providerId: dsService.meta.id }, { $set: { providerName: dsService.meta.name } });

        await db
            .collection(DATA_LOG_COLLECTION)
            .updateMany(
                { providerId: dataBretagneService.meta.id },
                { $set: { providerName: dataBretagneService.meta.name } },
            );

        await db
            .collection(DATA_LOG_COLLECTION)
            .updateMany({ providerId: fonjepService.meta.id }, { $set: { providerName: fonjepService.meta.name } });

        await db
            .collection(DATA_LOG_COLLECTION)
            .updateMany({ providerId: osirisService.meta.id }, { $set: { providerName: osirisService.meta.name } });

        await db
            .collection(DATA_LOG_COLLECTION)
            .updateMany({ providerId: chorusService.meta.id }, { $set: { providerName: chorusService.meta.name } });

        await db
            .collection(DATA_LOG_COLLECTION)
            .updateMany(
                { providerId: subventiaService.meta.id },
                { $set: { providerName: subventiaService.meta.name } },
            );

        const bulkWriteOps = [];
        await db
            .collection(DATA_LOG_COLLECTION)
            .aggregate([
                { $match: { providerId: new RegExp(/[0-9]{14}/), providerName: { $exists: false } } },
                {
                    $lookup: {
                        from: "misc-scdl-producers",
                        localField: "providerId",
                        foreignField: "siret",
                        as: "producer",
                    },
                },
                {
                    $unwind: { path: "$producer" },
                },
                { $addFields: { providerName: "$producer.name" } },
                {
                    $project: {
                        _id: 1,
                        providerName: 1,
                    },
                },
            ])
            .forEach(result => {
                bulkWriteOps.push({
                    updateOne: {
                        filter: { _id: result._id },
                        update: { $set: { providerName: result.providerName } },
                    },
                });
            });

        await db.collection(DATA_LOG_COLLECTION).bulkWrite(bulkWriteOps);
    },
};
