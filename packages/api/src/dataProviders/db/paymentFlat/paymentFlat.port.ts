import { FindCursor } from "mongodb";
import MongoPort from "../../../shared/MongoPort";
import { ChorusPaymentFlatEntity } from "../../../modules/providers/chorus/@types/ChorusPaymentFlat";
import Siren from "../../../identifierObjects/Siren";
import Siret from "../../../identifierObjects/Siret";
import { DefaultObject } from "../../../@types";
import PaymentFlatAdapter from "../../../modules/paymentFlat/paymentFlatAdapter";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import PaymentFlatDbo from "./PaymentFlatDbo";

// we omit _id because it is generated by MongoDB
export class PaymentFlatPort extends MongoPort<Omit<PaymentFlatDbo, "_id">> {
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
        return this.collection.updateOne({ uniqueId: updateDbo.uniqueId }, { $set: updateDbo }, { upsert: true });
    }

    private buildUpsertOperation(dbo: Omit<PaymentFlatDbo, "_id">) {
        return {
            updateOne: {
                filter: { uniqueId: dbo.uniqueId },
                update: { $set: dbo },
                upsert: true,
            },
        };
    }

    public upsertMany(entities: PaymentFlatEntity[]) {
        const bulk = entities.map(entity => this.buildUpsertOperation(PaymentFlatAdapter.toDbo(entity)));
        return this.collection.bulkWrite(bulk, { ordered: false });
    }

    public insertMany(entities: PaymentFlatEntity[]) {
        return this.collection.insertMany(entities.map(entity => PaymentFlatAdapter.toDbo(entity), { ordered: false }));
    }

    // used in test
    public async findAll() {
        return (await this.collection.find({})).toArray();
    }

    public cursorFind(query: DefaultObject<unknown> = {}, projection: DefaultObject<unknown> = {}) {
        return this.collection.find(query, projection).map(PaymentFlatAdapter.dboToEntity);
    }

    public cursorFindChorusOnly(exerciceBudgetaire?: number) {
        if (!exerciceBudgetaire) {
            return this.cursorFind({ provider: "chorus" }) as FindCursor<ChorusPaymentFlatEntity>;
        } else
            return this.cursorFind({
                provider: "chorus",
                exerciceBudgetaire: exerciceBudgetaire,
            }) as FindCursor<ChorusPaymentFlatEntity>;
    }

    public async deleteAll() {
        await this.collection.deleteMany({});
    }

    public async findBySiret(siret: Siret) {
        return this.collection
            .find({
                provider: "chorus", // remove to enable fonjep when application flat is ready
                typeIdEtablissementBeneficiaire: "siret",
                idEtablissementBeneficiaire: siret.value,
            })
            .map(PaymentFlatAdapter.dboToEntity)
            .toArray();
    }

    public async findBySiren(siren: Siren) {
        return this.collection
            .find({
                provider: "chorus", // remove to enable fonjep when application flat is ready
                $expr: {
                    $or: [
                        {
                            $and: [
                                { $eq: ["typeIdEtablissementBeneficiaire", "siret"] },
                                { $eq: ["idEntrepriseBeneficiaire", new RegExp(`^${siren.value}\\d{5}`)] },
                            ],
                        },
                        {
                            $and: [
                                { $eq: ["$typeIdEntrepriseBeneficiaire", "siren"] },
                                { $eq: ["$idEntrepriseBeneficiaire", siren.value] },
                            ],
                        },
                    ],
                },
            })
            .map(PaymentFlatAdapter.dboToEntity)
            .toArray();
    }

    public async findByEJ(ej: string) {
        return this.collection.find({ ej: ej }).map(PaymentFlatAdapter.dboToEntity).toArray();
    }
}

const paymentFlatPort = new PaymentFlatPort();
export default paymentFlatPort;
