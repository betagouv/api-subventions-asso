import { AnyBulkWriteOperation, Filter, FindOneAndUpdateOptions } from "mongodb";
import OsirisRequestEntity from "../../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import MongoAdapter from "../../MongoAdapter";
import Siret from "../../../../../identifier-objects/Siret";
import Rna from "../../../../../identifier-objects/Rna";
import Siren from "../../../../../identifier-objects/Siren";
import { OsirisRequestPort } from "./osiris-request.port";
import { BulkUpsertResult } from "../../@types/bulk-upsert-result";

export class OsirisRequestAdapter extends MongoAdapter<OsirisRequestEntity> implements OsirisRequestPort {
    collectionName = "osiris-requests";

    async createIndexes() {
        await this.collection.createIndex({ "dossier.osirisId": 1, "dossier.exerciceBudgetaire": 1 }, { unique: true });
        await this.collection.createIndex({ "dossier.osirisId": 1 });
        await this.collection.createIndex({ "association.rna": 1 });
        await this.collection.createIndex({ "association.siret": 1 });
    }

    joinIndexes = {
        osirisActionPort: "dossier.osirisId",
    };

    private getUpsertFilter(osirisRequest: OsirisRequestEntity): Filter<OsirisRequestEntity> {
        return {
            "dossier.osirisId": osirisRequest.dossier.osirisId,
            "dossier.exerciceBudgetaire": osirisRequest.dossier.exerciceBudgetaire,
        } as Filter<OsirisRequestEntity>;
    }

    public async add(osirisRequest: OsirisRequestEntity): Promise<void> {
        await this.collection.insertOne(osirisRequest);
    }

    /*
     * @deprecated
     * */
    public async update(osirisRequest: OsirisRequestEntity): Promise<OsirisRequestEntity> {
        const options = { returnDocument: "after", includeResultMetadata: true } as FindOneAndUpdateOptions;
        const updateRes = await this.collection.findOneAndUpdate(
            this.getUpsertFilter(osirisRequest),
            { $set: osirisRequest },
            options,
        );

        return (updateRes as { value?: OsirisRequestEntity })?.value as OsirisRequestEntity;
    }

    public upsertOne(osirisRequest: OsirisRequestEntity) {
        const options = { upsert: true } as FindOneAndUpdateOptions;
        return this.collection.updateOne(this.getUpsertFilter(osirisRequest), { $set: osirisRequest }, options);
    }

    public async bulkUpsert(osirisRequests: OsirisRequestEntity[]): Promise<BulkUpsertResult> {
        const bulk: AnyBulkWriteOperation<OsirisRequestEntity>[] = osirisRequests.map(request => {
            return {
                updateOne: {
                    filter: this.getUpsertFilter(request),
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
            .find({ "association.siret": siret.value } as unknown as Filter<OsirisRequestEntity>)
            .toArray();
    }

    public findByRna(rna: Rna): Promise<OsirisRequestEntity[]> {
        return this.collection
            .find({ "association.rna": rna.value } as unknown as Filter<OsirisRequestEntity>)
            .toArray();
    }

    public async findBySiren(siren: Siren): Promise<OsirisRequestEntity[]> {
        return this.collection
            .find({
                "association.siret": new RegExp(`^${siren.value}\\d{5}`),
            } as unknown as Filter<OsirisRequestEntity>)
            .toArray();
    }

    public findAll(): Promise<OsirisRequestEntity[]> {
        return this.collection.find({}).toArray();
    }
}

const osirisRequestAdapter: OsirisRequestAdapter = new OsirisRequestAdapter();
export default osirisRequestAdapter;
