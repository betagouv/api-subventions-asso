import { FindOneAndUpdateOptions } from "mongodb";
import OsirisRequestEntity from "../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import MongoPort from "../../../../shared/MongoPort";
import Siret from "../../../../identifierObjects/Siret";
import Rna from "../../../../identifierObjects/Rna";
import Siren from "../../../../identifierObjects/Siren";

export class OsirisRequestPort extends MongoPort<OsirisRequestEntity> {
    collectionName = "osiris-requests";

    async createIndexes() {
        await this.collection.createIndex({ "providerInformations.uniqueId": 1 }, { unique: true });
        await this.collection.createIndex({ "providerInformations.osirisId": 1 });
        await this.collection.createIndex({ "legalInformations.rna": 1 });
        await this.collection.createIndex({ "legalInformations.siret": 1 });
    }

    joinIndexes = {
        osirisActionPort: "providerInformations.uniqueId",
    };

    public async add(osirisRequest: OsirisRequestEntity) {
        return this.collection.insertOne(osirisRequest);
    }

    /*
     * @deprecated
     * */
    public async update(osirisRequest: OsirisRequestEntity) {
        const options = { returnDocument: "after", includeResultMetadata: true } as FindOneAndUpdateOptions;
        const updateRes = await this.collection.findOneAndUpdate(
            { "providerInformations.uniqueId": osirisRequest.providerInformations.uniqueId },
            { $set: osirisRequest },
            options,
        );
        //@ts-expect-error -- mongo typing expects no metadata
        return updateRes?.value as OsirisRequestEntity;
    }

    public upsertOne(osirisRequest: OsirisRequestEntity) {
        const options = { upsert: true } as FindOneAndUpdateOptions;
        return this.collection.updateOne(
            { "providerInformations.uniqueId": osirisRequest.providerInformations.uniqueId },
            { $set: osirisRequest },
            options,
        );
    }

    public async bulkUpsert(osirisRequests: OsirisRequestEntity[]) {
        const bulk = osirisRequests.map(request => {
            return {
                updateOne: {
                    filter: { "providerInformations.uniqueId": request.providerInformations.uniqueId },
                    update: { $set: request },
                    upsert: true,
                },
            };
        });
        return bulk.length ? this.collection.bulkWrite(bulk, { ordered: false }) : Promise.resolve();
    }

    public findBySiret(siret: Siret) {
        return this.collection
            .find({
                "legalInformations.siret": siret.value,
            })
            .toArray();
    }

    public findByRna(rna: Rna) {
        return this.collection
            .find({
                "legalInformations.rna": rna.value,
            })
            .toArray();
    }

    public async findBySiren(siren: Siren) {
        return this.collection
            .find({
                "legalInformations.siret": new RegExp(`^${siren.value}\\d{5}`),
            })
            .toArray();
    }

    // Only used in one migration, should be removed later ?
    public cursorFindRequests(query = {}) {
        return this.collection.find(query);
    }

    public async getAll() {
        return this.cursorFindRequests().toArray();
    }

    async getAllByExercise(exercise: number) {
        return this.cursorFindRequests({ "providerInformations.exercise": exercise }).toArray();
    }
}

const osirisRequestPort: OsirisRequestPort = new OsirisRequestPort();
export default osirisRequestPort;
