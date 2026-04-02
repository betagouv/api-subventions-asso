import { FindOneAndUpdateOptions } from "mongodb";
import OsirisRequestEntity from "../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import MongoAdapter from "../../MongoAdapter";
import Siret from "../../../../identifierObjects/Siret";
import Rna from "../../../../identifierObjects/Rna";
import Siren from "../../../../identifierObjects/Siren";
import { OsirisRequestPort } from "./osiris-request.port";
import { BulkUpsertResult } from "../../@types/bulk-upsert-result";

export class OsirisRequestAdapter extends MongoAdapter<OsirisRequestEntity> implements OsirisRequestPort {
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

    public async add(osirisRequest: OsirisRequestEntity): Promise<void> {
        await this.collection.insertOne(osirisRequest);
    }

    /*
     * @deprecated
     * */
    public async update(osirisRequest: OsirisRequestEntity): Promise<OsirisRequestEntity> {
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

    public async bulkUpsert(osirisRequests: OsirisRequestEntity[]): Promise<BulkUpsertResult> {
        const bulk = osirisRequests.map(request => {
            return {
                updateOne: {
                    filter: { "providerInformations.uniqueId": request.providerInformations.uniqueId },
                    update: { $set: request },
                    upsert: true,
                },
            };
        });

        if (!bulk.length) {
            return {
                insertedCount: 0,
                upsertedCount: 0,
                modifiedCount: 0,
                matchedCount: 0,
            };
        }

        const result = await this.collection.bulkWrite(bulk, { ordered: false });

        return {
            insertedCount: result.insertedCount,
            upsertedCount: result.upsertedCount,
            modifiedCount: result.modifiedCount,
            matchedCount: result.matchedCount,
        };
    }

    public findBySiret(siret: Siret): Promise<OsirisRequestEntity[]> {
        return this.collection
            .find({
                "legalInformations.siret": siret.value,
            })
            .toArray();
    }

    public findByRna(rna: Rna): Promise<OsirisRequestEntity[]> {
        return this.collection
            .find({
                "legalInformations.rna": rna.value,
            })
            .toArray();
    }

    public async findBySiren(siren: Siren): Promise<OsirisRequestEntity[]> {
        return this.collection
            .find({
                "legalInformations.siret": new RegExp(`^${siren.value}\\d{5}`),
            })
            .toArray();
    }

    // used in migration and integration tests
    public findAll(): Promise<OsirisRequestEntity[]> {
        return this.collection.find().toArray();
    }
}

const osirisRequestAdapter: OsirisRequestAdapter = new OsirisRequestAdapter();
export default osirisRequestAdapter;
