import AmountsVsProgramRegionMapper from "../../../../modules/dataViz/amountsVsProgramRegion/amounts-vs-program-region.mapper";
import { AmountsVsProgramRegionDbo } from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.dbo";
import AmountsVsProgramRegionEntity from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.entity";
import MongoPort from "../../../../shared/MongoPort";

export class AmountsVsProgramRegionPort extends MongoPort<Omit<AmountsVsProgramRegionDbo, "_id">> {
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

    public async hasBeenInitialized() {
        const dbo = await this.collection.findOne({});
        return !!dbo;
    }

    public insertOne(entity: AmountsVsProgramRegionEntity) {
        return this.collection.insertOne(AmountsVsProgramRegionMapper.toDbo(entity));
    }

    public upsertOne(entity: AmountsVsProgramRegionEntity) {
        const updateDbo = AmountsVsProgramRegionMapper.toDbo(entity);
        return this.collection.updateOne(
            {
                regionAttachementComptable: updateDbo.regionAttachementComptable,
                programme: updateDbo.programme,
                exerciceBudgetaire: updateDbo.exerciceBudgetaire,
            },
            { $set: updateDbo },
            { upsert: true },
        );
    }

    public insertMany(entities: AmountsVsProgramRegionEntity[]) {
        if (!entities.length) return;
        return this.collection.insertMany(
            entities.map(entity => AmountsVsProgramRegionMapper.toDbo(entity), { ordered: false }),
        );
    }

    public upsertMany(entities: AmountsVsProgramRegionEntity[]) {
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

        return this.collection.bulkWrite(bulkWriteArray, { ordered: false });
    }

    public async findAll() {
        const result = await this.collection.find({}).toArray();
        return result.map(dbo => AmountsVsProgramRegionMapper.toEntity(dbo));
    }

    public async deleteAll() {
        await this.collection.deleteMany({});
    }
}

const amountsVsProgramRegionPort = new AmountsVsProgramRegionPort();
export default amountsVsProgramRegionPort;
