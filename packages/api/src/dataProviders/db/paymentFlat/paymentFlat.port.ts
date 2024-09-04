import { AnyBulkWriteOperation } from "mongodb";
import MongoRepository from "../../../shared/MongoRepository";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import PaymentFlatDbo from "./PaymentFlatDbo";
import PaymentFlatAdapter from "./PaymentFlat.adapter";

export class PaymentFlatPort extends MongoRepository<PaymentFlatDbo> {
    collectionName = "payments-flat";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siret: 1, dateOperation: 1 });
    }

    public async insertOne(entity: PaymentFlatEntity) {
        return await this.collection.insertOne(PaymentFlatAdapter.toDbo(entity));
    }

    public async upsertOne(entity: PaymentFlatEntity) {
        const updateDbo = PaymentFlatAdapter.toDbo(entity);
        console.log(updateDbo);
        console.log(updateDbo.uniqueId);
        await this.collection.updateOne({ uniqueId: updateDbo.uniqueId }, { $set: updateDbo }, { upsert: true });
    }

    public async deleteAll() {
        await this.collection.deleteMany({});
    }
}

const paymentFlatPort = new PaymentFlatPort();
export default paymentFlatPort;
