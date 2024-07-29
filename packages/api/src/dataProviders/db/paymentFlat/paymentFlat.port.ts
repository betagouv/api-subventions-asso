import MongoRepository from "../../../shared/MongoRepository";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import PaymentFlatDbo from "./PaymentFlatDbo";
import PaymentFlatAdapter from "./PaymentFlat.adapter";

export class PaymentFlatPort extends MongoRepository<PaymentFlatDbo> {
    /* Giulia asks :
     * si la collection existe la classe crée la connexion à la collection
     * si la collection n'existe pas la classe crée la collection et la connexion à la collection
     * J'ai bien compris ?
     */

    collectionName = "payments-flat";

    public createIndexes(): void {
        this.collection.createIndex({ siret: 1 });
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