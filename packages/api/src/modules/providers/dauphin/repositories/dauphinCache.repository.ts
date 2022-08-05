import { Siren, Siret } from "@api-subventions-asso/dto";
import MigrationRepository from "../../../../shared/MigrationRepository";
import DauphinSubventionDto from "../dto/DauphinSubventionDto";

export class DauhpinCachesRepository extends MigrationRepository<DauphinSubventionDto> {
    readonly collectionName = "dauphin-caches";

    async upsert(entity: DauphinSubventionDto) {
        return this.collection.updateOne({
            reference: entity.reference
        }, { $set: entity }, { upsert: true });
    }

    findBySiret(siret: Siret) {
        return this.collection.find({
            "demandeur.SIRET.complet": siret
        }).toArray();
    }

    findBySiren(siren: Siren) {
        return this.collection.find({
            "demandeur.SIRET.SIREN": siren
        }).toArray();
    }

    async getLastUpdateBySiren(siren: Siren): Promise<Date | undefined> {
        const result = await this.collection.aggregate([
            { $match: {
                "demandeur.SIRET.SIREN": siren
            }},
            { $addFields: {
                dateVersion: { $toDate: "$_document.dateVersion" }
            }},
            { $sort: {
                dateVersion: -1
            }},
            {
                $limit: 1
            }
        ]).toArray();

        if (result.length) return new Date(result[0]._document.dateVersion);
        return undefined;
    }

    async getLastUpdateBySiret(siret: Siret): Promise<Date | undefined> {
        const result = await this.collection.aggregate([
            { $match: {
                "demandeur.SIRET.complet": siret
            }},
            { $addFields: {
                dateVersion: { $toDate: "$_document.dateVersion" }
            }},
            { $sort: {
                "dateVersion": -1
            }},
            {
                $limit: 1
            }
        ]).toArray();

        if (result.length) return new Date(result[0]._document.dateVersion);
        return undefined;
    }
}

const dauhpinCachesRepository = new DauhpinCachesRepository();

export default dauhpinCachesRepository;