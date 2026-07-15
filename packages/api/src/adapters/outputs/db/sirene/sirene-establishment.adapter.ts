import { AnyBulkWriteOperation } from "mongodb";
import MongoAdapter from "../MongoAdapter";
import SireneEstablishmentDto from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.dto";
import { SireneEstablishmentDbo, SireneEstablishmentDateDbo } from "./sirene-establishment.dbo";
import { SireneEstablishmentPort } from "./sirene-establishment.port";

export class SireneEstablishmentAdapter
    extends MongoAdapter<SireneEstablishmentDbo>
    implements SireneEstablishmentPort
{
    collectionName = "etablissement";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siret: 1 }, { unique: true });
    }

    public async saveNewer(dtos: SireneEstablishmentDto[]): Promise<number> {
        if (!dtos.length) return 0;

        const existingDates = await this.findExistingDates(dtos.map(dto => dto.siret));
        const dtosToSave = dtos.filter(dto => this.isNewer(dto, existingDates.get(dto.siret)));
        if (!dtosToSave.length) return 0;

        const bulk: AnyBulkWriteOperation<SireneEstablishmentDbo>[] = dtosToSave.map(dto => ({
            updateOne: {
                filter: { siret: dto.siret },
                update: { $set: dto },
                upsert: true,
            },
        }));

        await this.collection.bulkWrite(bulk, { ordered: false });
        return dtosToSave.length;
    }

    private async findExistingDates(sirets: string[]): Promise<Map<string, Date>> {
        const dbos = await this.collection
            .find(
                { siret: { $in: [...new Set(sirets)] } },
                { projection: { siret: 1, dateDernierTraitementEtablissement: 1 } },
            )
            .toArray();

        return new Map(
            (dbos as SireneEstablishmentDateDbo[]).map(dbo => [dbo.siret, dbo.dateDernierTraitementEtablissement]),
        );
    }

    private isNewer(dto: SireneEstablishmentDto, existingDate?: Date): boolean {
        return !existingDate || dto.dateDernierTraitementEtablissement > existingDate;
    }
}

const sireneEstablishmentAdapter = new SireneEstablishmentAdapter();
export default sireneEstablishmentAdapter;
