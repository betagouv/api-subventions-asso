const dauphinService = require("../build/src/modules/providers/dauphin-gispro/dauphin.service").default;
const dsService = require("../build/src/modules/providers/demarchesSimplifiees/demarchesSimplifiees.service").default;
const dataBretagneService = require("../build/src/modules/providers/dataBretagne/dataBretagne.service").default;
const gisproService = require("../build/src/modules/providers/dauphin-gispro/gispro.service").default;
const { DataLogSource } = require("../build/src/modules/data-log/entities/dataLogEntity");

module.exports = {
    async up(db) {
        await db
            .collection("data-log")
            .updateMany(
                { providerId: { $nin: [dauphinService.meta.id, dsService.meta.id, dataBretagneService.meta.id] } },
                { $set: { source: DataLogSource.FILE } },
            );

        // special case for GISPRO wich was logged with dauphin id but behave differently for data import
        await db
            .collection("data-log")
            .updateMany(
                { providerId: dauphinService.meta.id, fileName: { $ne: "api" } },
                { $set: { providerId: gisproService.meta.id, source: DataLogSource.FILE } },
            );

        await db.collection("data-log").updateMany(
            { providerId: { $in: [dauphinService.meta.id, dsService.meta.id, dataBretagneService.meta.id] } },
            {
                $set: { source: DataLogSource.API },
                $unset: { fileName: 1 }, // remove fileName: "api"
            },
        );
    },
};
