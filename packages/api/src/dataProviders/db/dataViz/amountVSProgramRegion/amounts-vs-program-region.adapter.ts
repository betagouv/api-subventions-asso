import AmountsVsProgramRegionEntity from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.entity";
import AmountsVsProgramRegionMapper from "../../../../modules/dataViz/amountsVsProgramRegion/amounts-vs-program-region.mapper";
import MongoPort from "../../../../shared/MongoPort";
import { AmountsVsProgramRegionDbo } from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.dbo";
import { AmountsVsProgramRegionPort } from "./amounts-vs-program-region.port";

class AmountsVsProgramRegionAdapter
    extends MongoPort<Omit<AmountsVsProgramRegionDbo, "_id">>
    implements AmountsVsProgramRegionPort
{
    collectionName = "dv--montant-programme-region";

    public async createIndexes() {
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

    public async insertOne(entity: AmountsVsProgramRegionEntity): Promise<string> {
        const result = await this.collection.insertOne(AmountsVsProgramRegionMapper.toDbo(entity));
        return result.insertedId.toString();
    }

    public async upsertOne(entity: AmountsVsProgramRegionEntity): Promise<string | undefined> {
        const updateDbo = AmountsVsProgramRegionMapper.toDbo(entity);
        const result = await this.collection.updateOne(
            {
                regionAttachementComptable: updateDbo.regionAttachementComptable,
                programme: updateDbo.programme,
                exerciceBudgetaire: updateDbo.exerciceBudgetaire,
            },
            { $set: updateDbo },
            { upsert: true },
        );
        return result.upsertedId?.toString();
    }

    public async insertMany(entities: AmountsVsProgramRegionEntity[]): Promise<string[] | undefined> {
        if (!entities.length) return;
        const result = await this.collection.insertMany(
            entities.map(entity => AmountsVsProgramRegionMapper.toDbo(entity), { ordered: false }),
        );
        return Object.values(result.insertedIds).map(id => id.toString());
    }

    public async upsertMany(entities: AmountsVsProgramRegionEntity[]): Promise<string[] | undefined> {
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

        const result = await this.collection.bulkWrite(bulkWriteArray, { ordered: false });
        return Object.values(result.insertedIds).map(id => id.toString());
    }

    public async findAll(): Promise<AmountsVsProgramRegionEntity[]> {
        const result = await this.collection.find({}).toArray();
        return result.map(dbo => AmountsVsProgramRegionMapper.toEntity(dbo));
    }

    public async deleteAll(): Promise<boolean> {
        const result = await this.collection.deleteMany({});
        return result.deletedCount > 0;
    }
}

const amountsVsProgramRegionAdapter = new AmountsVsProgramRegionAdapter();

export default amountsVsProgramRegionAdapter;
