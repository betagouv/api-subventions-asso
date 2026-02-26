import { Collection, FindCursor } from "mongodb";
import MongoPort from "../../../../shared/MongoPort";
import DauphinSubventionDto from "../../../../modules/providers/dauphin-gispro/dto/DauphinSubventionDto";
import Siret from "../../../../identifierObjects/Siret";
import Siren from "../../../../identifierObjects/Siren";
import DauphinGisproDbo from "./DauphinGisproDbo";
import { SimplifiedJoinedDauphinGispro } from "../../../../modules/providers/dauphin-gispro/@types/SimplifiedDauphinGispro";

export class DauphinPort extends MongoPort<DauphinGisproDbo> {
    readonly collectionName = "dauphin";
    readonly simplifiedTempCollectionName = "dauphinSimplified";
    readonly simplifiedTempCollection = this.db.collection(this.simplifiedTempCollectionName);

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
                { $project: { dateVersion: { $toDate: "$dauphin._document.dateVersion" } } },
                { $sort: { dateVersion: -1 } },
                { $limit: 1 },
            ])
            .toArray()
            .then(arrs => {
                return arrs[0] || null;
            });
        if (result) return new Date(result.dateVersion);
        return result;
    }

    async migrateDauphinCacheToDauphin(logger: (message: string, writeOnSameLine?: boolean) => void) {
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
        await collection.rename("dauphin");
        logger("Rename collection is finished");

        logger("Create new indexes");
        await this.createIndexes();
        logger("All new indexes have been created");
    }

    /* FLAT OPERATIONS */

    async createSimplifiedDauphinBeforeJoin() {
        console.log("cleaning simplified dauphin...");
        await this.cleanTempCollection();
        console.log("creating simplified dauphin...");
        await this.collection
            .aggregate(
                [
                    // only keep useful columns
                    {
                        $project: {
                            exerciceBudgetaire: "$dauphin.exerciceBudgetaire",
                            siretDemandeur: "$dauphin.demandeur.SIRET.complet",
                            referenceAdministrative: "$dauphin.codeActionProjet",
                            intituleProjet: "$dauphin.intituleProjet",
                            periode: "$dauphin.periode",
                            dateDemande: "$dauphin.dateDemande",
                            thematique: "$dauphin.thematique.title",
                            virtualStatusLabel: "$dauphin.virtualStatusLabel",
                            description: "$dauphin.description.value",
                            planFinancement: "$dauphin.planFinancement",
                            updateDate: "$dauphin.updateDate",
                        },
                    },

                    // filter budgetary lines according to anct doc
                    { $unwind: { path: "$planFinancement" } },
                    { $match: { "planFinancement.current": true } },
                    { $addFields: { planFinancement_poste: "$planFinancement.recette.postes" } },
                    { $unwind: { path: "$planFinancement_poste" } },
                    { $match: { "planFinancement_poste.reference": "74" } },
                    { $addFields: { planFinancement_sousPostes: "$planFinancement_poste.sousPostes" } },
                    { $unwind: { path: "$planFinancement_sousPostes" } },
                    { $match: { "planFinancement_sousPostes.reference": "74etat" } },
                    { $addFields: { planFinancement_lignes: "$planFinancement_sousPostes.lignes" } },
                    { $unwind: { path: "$planFinancement_lignes" } },
                    {
                        $match: {
                            "planFinancement_lignes.financement.financeur.typeFinanceur": "FINANCEURPRIVILEGIE",
                            "planFinancement_lignes.financement.financeur.titre": { $ne: "FONJEP" },
                            // may need to be adapted according to discussions with ANCT
                        },
                    },

                    // remove intermediary columns
                    {
                        $project: {
                            planFinancement_sousPostes: 0,
                            planFinancement_poste: 0,
                            planFinancement: 0,
                            _id: 0,
                        },
                    },
                    { $out: this.simplifiedTempCollectionName },
                ],
                { allowDiskUse: true },
            )
            .toArray();

        console.log("creating indexe for simplified dauphin...");
        // create index for gispro join used in joinGisproToSimplified()
        await this.simplifiedTempCollection.createIndex({ referenceAdministrative: 1 });
    }

    async joinGisproToSimplified() {
        await this.simplifiedTempCollection
            .aggregate(
                [
                    // join gispro data
                    {
                        $lookup: {
                            from: "gispro",
                            localField: "referenceAdministrative",
                            foreignField: "codeActionDossier",
                            as: "gispro",
                        },
                    },

                    // we can't interpret gispro data if we have several ; see #3595
                    {
                        $addFields: {
                            gispro: { $cond: { if: { $gt: [{ $size: "$gispro" }, 1] }, then: [], else: "$gispro" } },
                        },
                    },

                    { $unwind: { path: "$gispro", preserveNullAndEmptyArrays: true } },

                    // create group parameter according to success of gispro join
                    { $addFields: { toJoinOn: { $ifNull: ["$gispro.codeProjet", "$referenceAdministrative"] } } },

                    // group action level into subvention level
                    {
                        $group: {
                            _id: {
                                siretDemandeur: "$siretDemandeur",
                                exerciceBudgetaire: "$exerciceBudgetaire",
                                codeDossierOrAction: "$toJoinOn",
                            },
                            montantDemande: { $sum: "$planFinancement_lignes.montant.ht" },
                            montantAccorde: { $sum: "$planFinancement_lignes.financement.montantVote.ht" },

                            referenceAdministrative: { $addToSet: "$referenceAdministrative" },
                            intituleProjet: { $addToSet: "$intituleProjet" },
                            thematique: { $addToSet: "$thematique" },
                            financeurs: { $addToSet: "$planFinancement_lignes.financement.financeur.title" },
                            instructorService: { $addToSet: "$gispro.directionGestionnaire" },

                            periode: { $addToSet: "$periode" },
                            virtualStatusLabel: { $addToSet: "$virtualStatusLabel" },
                            ej: { $addToSet: "$gispro.ej" },

                            dateDemande: { $addToSet: "$dateDemande" },
                            codeDossier: { $first: "$gispro.codeProjet" },
                            updateDate: { $min: "$updateDate" },
                        },
                    },

                    // format nicely arguments that were in join
                    {
                        $addFields: {
                            siretDemandeur: "$_id.siretDemandeur",
                            exerciceBudgetaire: "$_id.exerciceBudgetaire",
                        },
                    },
                    { $out: this.simplifiedTempCollectionName },
                ],
                {
                    allowDiskUse: true,
                },
            )
            .toArray();
    }

    findAllTempCursor() {
        return this.simplifiedTempCollection.find({}) as unknown as FindCursor<SimplifiedJoinedDauphinGispro>;
    }

    async cleanTempCollection() {
        await this.simplifiedTempCollection.deleteMany({});
    }
}

const dauphinPort = new DauphinPort();

export default dauphinPort;
