import { AmountsVsProgramRegionDbo } from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.dbo";
import AmountsVsProgramRegionEntity from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.entity";
import MongoPort from "../../../../shared/MongoPort";
import AmountsVsProgramRegionAdapter from "./amountsVsProgramRegion.adapter";

export class AmountsVsProgramRegionPort extends MongoPort<AmountsVsProgramRegionDbo> {
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

    public async hasBeenInitialized() {
        const dbo = await this.collection.findOne({});
        return !!dbo;
    }

    public insertOne(entity: AmountsVsProgramRegionEntity) {
        return this.collection.insertOne(AmountsVsProgramRegionAdapter.toDbo(entity));
    }

    public upsertOne(entity: AmountsVsProgramRegionEntity) {
        const updateDbo = AmountsVsProgramRegionAdapter.toDbo(entity);
        const { _id, ...DboWithoutId } = updateDbo;
        return this.collection.updateOne(
            {
                regionAttachementComptable: updateDbo.regionAttachementComptable,
                programme: updateDbo.programme,
                exerciceBudgetaire: updateDbo.exerciceBudgetaire,
            },
            { $set: DboWithoutId },
            { upsert: true },
        );
    }

    public insertMany(entities: AmountsVsProgramRegionEntity[]) {
        return this.collection.insertMany(
            entities.map(entity => AmountsVsProgramRegionAdapter.toDbo(entity), { ordered: false }),
        );
    }

    public upsertMany(entities: AmountsVsProgramRegionEntity[]) {
        const bulkWriteArray = entities.map(entity => {
            const updateDbo = AmountsVsProgramRegionAdapter.toDbo(entity);
            const { _id, ...DboWithoutId } = updateDbo;
            return {
                updateOne: {
                    filter: {
                        regionAttachementComptable: updateDbo.regionAttachementComptable,
                        programme: updateDbo.programme,
                        exerciceBudgetaire: updateDbo.exerciceBudgetaire,
                    },
                    update: { $set: DboWithoutId },
                    upsert: true,
                },
            };
        });

        return this.collection.bulkWrite(bulkWriteArray, { ordered: false });
    }

    public async findAll() {
        const result = await this.collection.find({}).toArray();
        return result.map(dbo => AmountsVsProgrammeRegionAdapter.toEntity(dbo));
    }

    public async deleteAll() {
        await this.collection.deleteMany({});
    }
}

const amountsVsProgrammeRegionPort = new AmountsVsProgramRegionPort();
export default amountsVsProgrammeRegionPort;
