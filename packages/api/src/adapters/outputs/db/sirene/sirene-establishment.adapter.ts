import MongoAdapter from "../MongoAdapter";
import SireneEstablishmentDto from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.dto";
import { SireneEstablishmentDbo } from "./sirene-establishment.dbo";
import { AssociationSearchPostalCodes, SireneEstablishmentPort } from "./sirene-establishment.port";
import { Siren } from "../../../../identifier-objects";
import { EstablishmentEntity } from "../../../../domain/structures/establishments/EstablishmentEntity";
import { toEntity } from "./sirene-establishment.mapper";

interface SireneEstablishmentAggregateDbo {
    siren: string;
    postalCodes: string[];
}

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

    public computeNbEstab() {
        return this.collection.aggregate<{ siren: string; nbEstabs: number }>([
            {
                $group: {
                    _id: "$siren",
                    nbEstabs: {
                        $sum: 1,
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    siren: "$_id",
                    nbEstabs: 1,
                },
            },
        ]);
    }

    public async getPostalCodesBySirens(sirens: string[]): Promise<AssociationSearchPostalCodes[]> {
        const uniqueSirens = [...new Set(sirens)];
        if (!uniqueSirens.length) return [];

        const aggregateResult = await this.collection
            .aggregate<SireneEstablishmentAggregateDbo>([
                { $match: { siren: { $in: uniqueSirens } } },
                {
                    $group: {
                        _id: "$siren",
                        postalCodes: { $addToSet: "$codePostalEtablissement" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        siren: "$_id",
                        postalCodes: {
                            $filter: {
                                input: "$postalCodes",
                                as: "postalCode",
                                cond: { $ne: ["$$postalCode", null] },
                            },
                        },
                    },
                },
            ])
            .toArray();

        return aggregateResult.map(({ siren, postalCodes }) => ({
            siren,
            postalCodes: postalCodes.sort(),
        }));
    }
}

const sireneEstablishmentAdapter = new SireneEstablishmentAdapter();
export default sireneEstablishmentAdapter;
