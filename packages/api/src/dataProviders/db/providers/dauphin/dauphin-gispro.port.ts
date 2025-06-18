import { Collection } from "mongodb";
import MongoPort from "../../../../shared/MongoPort";
import DauphinSubventionDto from "../../../../modules/providers/dauphin/dto/DauphinSubventionDto";
import Siret from "../../../../identifierObjects/Siret";
import Siren from "../../../../identifierObjects/Siren";
import DauphinGisproDbo from "./DauphinGisproDbo";

export class DauphinGisproPort extends MongoPort<DauphinGisproDbo> {
    readonly collectionName = "dauphin-gispro";

    async createIndexes() {
        await this.collection.createIndex({ "dauphin.demandeur.SIRET.complet": 1 });
        await this.collection.createIndex({ "dauphin.demandeur.SIRET.SIREN": 1 });
        // Unique id on dauphin
        await this.collection.createIndex({ "dauphin.reference": 1 });
        // Unique id on gispro
        await this.collection.createIndex({ "dauphin.multiFinancement.financeurs.source.reference": 1 });
        await this.collection.createIndex({ "dauphin.codeActionProject": 1 });
    }

    async upsert(entity: DauphinGisproDbo) {
        return this.collection.updateOne(
            { "dauphin.reference": entity.dauphin.reference },
            { $set: entity as Partial<DauphinGisproDbo> },
            { upsert: true },
        );
    }

    findBySiret(siret: Siret) {
        return this.collection
            .find({
                "dauphin.demandeur.SIRET.complet": siret.value,
                "dauphin.exerciceBudgetaire": { $lt: 2023 }, // we lost access in 2022 so data after this year is incomplete and confusing
            })
            .toArray();
    }

    findBySiren(siren: Siren) {
        return this.collection
            .find({
                "dauphin.demandeur.SIRET.SIREN": siren.value,
                "dauphin.exerciceBudgetaire": { $lt: 2023 }, // we lost access in 2022 so data after this year is incomplete and confusing
            })
            .toArray();
    }

    findOneByDauphinId(codeDossier: string) {
        return this.collection.findOne({
            "dauphin.codeActionProject": codeDossier,
        });
    }

    async getLastImportDate() {
        const result = await this.collection
            .aggregate([
                {
                    $addFields: {
                        dateVersion: { $toDate: "$dauphin._document.dateVersion" },
                    },
                },
                {
                    $sort: {
                        dateVersion: -1,
                    },
                },
                { $project: { dateVersion: "$dateVersion" } },
                {
                    $limit: 1,
                },
            ])
            .toArray()
            .then(arrs => {
                return arrs[0] || null;
            });
        if (result) return new Date(result.dateVersion);
        return result;
    }

    async migrateDauphinCacheToDauphinGispro(logger: (message: string, writeOnSameLine?: boolean) => void) {
        const collection: Collection<DauphinGisproDbo> = this.db.collection("dauphin-caches");
        await collection.dropIndexes();

        logger("Start update all entities");
        const cursor = collection.find();
        let i = 0;

        for await (const entity of cursor) {
            const updateQuery = {
                $unset: {
                    ...Object.keys(entity).reduce((acc, key) => {
                        if (key == "_id") return acc;
                        acc[key] = "";
                        return acc;
                    }, {}),
                },
                $set: { dauphin: entity as unknown as DauphinSubventionDto },
            };

            await collection.updateOne({ _id: entity._id }, updateQuery);
            i++;
            logger(i + " entites saved", true);
        }

        logger("All entities has been updated");

        logger("Rename collection");
        await collection.rename("dauphin-gispro");
        logger("Rename collection is finished");

        logger("Create new indexes");
        await this.createIndexes();
        logger("All new indexes have been created");
    }
}

const dauphinGisproPort = new DauphinGisproPort();

export default dauphinGisproPort;
