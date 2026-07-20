import MongoAdapter from "../MongoAdapter";
import SireneEstablishmentDto from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.dto";
import { SireneEstablishmentDbo } from "./sirene-establishment.dbo";
import { SireneEstablishmentPort } from "./sirene-establishment.port";

export class SireneEstablishmentAdapter
    extends MongoAdapter<SireneEstablishmentDbo>
    implements SireneEstablishmentPort
{
    collectionName = "etablissement";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siret: 1 }, { unique: true });
    }

    public async upsertMany(dtos: SireneEstablishmentDto[]): Promise<number> {
        if (!dtos.length) return 0;

        await this.collection.bulkWrite(
            dtos.map(dto => ({
                updateOne: {
                    filter: { siret: dto.siret },
                    update: { $set: dto },
                    upsert: true,
                },
            })),
            { ordered: false },
        );
        return dtos.length;
    }
}

const sireneEstablishmentAdapter = new SireneEstablishmentAdapter();
export default sireneEstablishmentAdapter;
