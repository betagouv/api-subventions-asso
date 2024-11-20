import MongoRepository from "../../../shared/MongoRepository";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import PaymentFlatDbo from "./PaymentFlatDbo";
import PaymentFlatAdapter from "./PaymentFlat.adapter";

export class PaymentFlatPort extends MongoRepository<PaymentFlatDbo> {
    collectionName = "payments-flat";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siret: 1 });
        await this.collection.createIndex({ dateOperation: 1 });
        await this.collection.createIndex({ uniqueId: 1 }, { unique: true });
    }

    public async hasBeenInitialized() {
        const dbo = await this.collection.findOne({});
        return !!dbo;
    }

    public insertOne(entity: PaymentFlatEntity) {
        return this.collection.insertOne(PaymentFlatAdapter.toDbo(entity));
    }

    public upsertOne(entity: PaymentFlatEntity) {
        const updateDbo = PaymentFlatAdapter.toDbo(entity);
        const { _id, ...DboWithoutId } = updateDbo;
        return this.collection.updateOne({ uniqueId: updateDbo.uniqueId }, { $set: DboWithoutId }, { upsert: true });
    }

    public upsertMany(bulk) {
        return this.collection.bulkWrite(bulk, { ordered: false });
    }

    public insertMany(entities: PaymentFlatEntity[]) {
        return this.collection.insertMany(entities.map(entity => PaymentFlatAdapter.toDbo(entity), { ordered: false }));
    }

    public async deleteAll() {
        await this.collection.deleteMany({});
    }
}

const paymentFlatPort = new PaymentFlatPort();
export default paymentFlatPort;
