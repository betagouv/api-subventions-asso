import MongoAdapter from "../MongoAdapter";
import SireneEstablishmentDto from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.dto";
import { SireneEstablishmentDbo } from "./sirene-establishment.dbo";
import { SireneEstablishmentPort } from "./sirene-establishment.port";
import { Siren } from "../../../../identifier-objects";
import { EstablishmentEntity } from "../../../../domain/structures/establishments/EstablishmentEntity";
import { toEntity } from "./sirene-establishment.mapper";

export class SireneEstablishmentAdapter
    extends MongoAdapter<SireneEstablishmentDbo>
    implements SireneEstablishmentPort
{
    collectionName = "etablissement";

    public async createIndexes() {
        await this.collection.createIndex({ siret: 1 }, { unique: true });
        await this.collection.createIndex({ siren: 1 });
    }

    public async upsertMany(dtos: SireneEstablishmentDto[]) {
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

    public async getAllBySiren(siren: Siren): Promise<EstablishmentEntity[]> {
        const dbos = await this.collection.find({ siren: siren.value }).toArray();
        if (!dbos) return [];
        return dbos.map(dbo => toEntity(dbo));
    }
}

const sireneEstablishmentAdapter = new SireneEstablishmentAdapter();
export default sireneEstablishmentAdapter;
