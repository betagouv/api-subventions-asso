import AmountsVsProgramRegionMapper from "../../../../modules/dataViz/amountsVsProgramRegion/amounts-vs-program-region.mapper";
import { AmountsVsProgramRegionDbo } from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.dbo";
import AmountsVsProgramRegionEntity from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.entity";
import MongoAdapter from "../../MongoAdapter";
import { AmountsVSProgramRegionPort } from "./amounts-vs-program-region.port";

export class AmountsVsProgramRegionAdapter
    extends MongoAdapter<Omit<AmountsVsProgramRegionDbo, "_id">>
    implements AmountsVSProgramRegionPort
{
    collectionName = "dv--montant-programme-region";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ regionAttachementComptable: 1 });
        await this.collection.createIndex({ programme: 1 });
        await this.collection.createIndex({ exerciceBudgetaire: 1 });
        await this.collection.createIndex(
            { regionAttachementComptable: 1, programme: 1, exerciceBudgetaire: 1 },
            { unique: true },
        );
    }

    public async hasBeenInitialized(): Promise<boolean> {
        const dbo = await this.collection.findOne({});
        return !!dbo;
    }

    public async insertOne(entity: AmountsVsProgramRegionEntity): Promise<void> {
        await this.collection.insertOne(AmountsVsProgramRegionMapper.toDbo(entity));
    }

    public async upsertOne(entity: AmountsVsProgramRegionEntity): Promise<void> {
        const updateDbo = AmountsVsProgramRegionMapper.toDbo(entity);
        await this.collection.updateOne(
            {
                regionAttachementComptable: updateDbo.regionAttachementComptable,
                programme: updateDbo.programme,
                exerciceBudgetaire: updateDbo.exerciceBudgetaire,
            },
            { $set: updateDbo },
            { upsert: true },
        );
    }

    public async insertMany(entities: AmountsVsProgramRegionEntity[]): Promise<void> {
        if (!entities.length) return;
        await this.collection.insertMany(
            entities.map(entity => AmountsVsProgramRegionMapper.toDbo(entity), { ordered: false }),
        );
    }

    public async upsertMany(entities: AmountsVsProgramRegionEntity[]): Promise<void> {
        if (!entities.length) return;
        const bulkWriteArray = entities.map(entity => {
            const updateDbo = AmountsVsProgramRegionMapper.toDbo(entity);
            return {
                updateOne: {
                    filter: {
                        regionAttachementComptable: updateDbo.regionAttachementComptable,
                        programme: updateDbo.programme,
                        exerciceBudgetaire: updateDbo.exerciceBudgetaire,
                    },
                    update: { $set: updateDbo },
                    upsert: true,
                },
            };
        });

        await this.collection.bulkWrite(bulkWriteArray, { ordered: false });
    }

    public async findAll(): Promise<AmountsVsProgramRegionEntity[]> {
        const result = await this.collection.find({}).toArray();
        return result.map(dbo => AmountsVsProgramRegionMapper.toEntity(dbo));
    }

    public async deleteAll(): Promise<void> {
        await this.collection.deleteMany({});
    }
}

const amountsVsProgramRegionAdapter = new AmountsVsProgramRegionAdapter();
export default amountsVsProgramRegionAdapter;
