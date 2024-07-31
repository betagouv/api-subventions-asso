import MongoRepository from "../../../shared/MongoRepository";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import PaymentFlatDbo from "./PaymentFlatDbo";
import PaymentFlatAdapter from "./PaymentFlat.adapter";

export class PaymentFlatPort extends MongoRepository<PaymentFlatDbo> {
    collectionName = "payments-flat";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siret: 1 });
    }

    public async insertOne(entity: PaymentFlatEntity) {
        return this.collection.insertOne(PaymentFlatAdapter.toDbo(entity));
    }

    public async deleteAll() {
        await this.collection.deleteMany({});
    }
}

const paymentFlatPort = new PaymentFlatPort();
export default paymentFlatPort;
