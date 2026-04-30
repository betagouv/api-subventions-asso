import { AnyBulkWriteOperation, Filter, FindOneAndUpdateOptions } from "mongodb";
import OsirisRequestEntity from "../../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import MongoAdapter from "../../MongoAdapter";
import Siret from "../../../../../identifier-objects/Siret";
import Rna from "../../../../../identifier-objects/Rna";
import Siren from "../../../../../identifier-objects/Siren";
import { OsirisRequestPort } from "./osiris-request.port";
import { BulkUpsertResult } from "../../@types/bulk-upsert-result";
import OsirisRequestMapper from "../../../../../modules/providers/osiris/mappers/osiris-request.mapper";

export class OsirisRequestAdapter extends MongoAdapter<OsirisRequestEntity> implements OsirisRequestPort {
    collectionName = "osiris-requests";

    // Raw request indexes. The request/actions unique id is rebuilt at read time from dossier.osirisId and dossier.exerciceBudgetaire.
    async createIndexes() {
        await this.collection.createIndex({ "dossier.osirisId": 1, "dossier.exerciceBudgetaire": 1 }, { unique: true });
        await this.collection.createIndex({ "dossier.osirisId": 1 });
        await this.collection.createIndex({ "association.rna": 1 });
        await this.collection.createIndex({ "beneficiaire.rna": 1 });
        await this.collection.createIndex({ "association.siret": 1 });
        await this.collection.createIndex({ "beneficiaire.siret": 1 });
    }

    joinIndexes = {
        osirisActionPort: "dossier.osirisId",
    };

    private readonly deprecatedFieldsProjection = {
        legalInformations: "",
        providerInformations: "",
        indexedInformations: "",
        data: "",
    } as const;

    private readonly findProjection = {
        projection: {
            legalInformations: 0,
            providerInformations: 0,
            indexedInformations: 0,
            data: 0,
        },
    };

    private toFilter(filter: Record<string, unknown>): Filter<OsirisRequestEntity> {
        return filter as unknown as Filter<OsirisRequestEntity>;
    }

    private getUpsertFilter(osirisRequest: OsirisRequestEntity): Filter<OsirisRequestEntity> {
        const providerInformations = OsirisRequestMapper.getProviderInformations(osirisRequest);

        return this.toFilter({
            "dossier.osirisId": providerInformations.osirisId,
            "dossier.exerciceBudgetaire": providerInformations.exercise,
        });
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
            { $set: osirisRequest, $unset: this.deprecatedFieldsProjection },
            options,
        );

        return (updateRes as { value?: OsirisRequestEntity })?.value as OsirisRequestEntity;
    }

    public upsertOne(osirisRequest: OsirisRequestEntity) {
        const options = { upsert: true } as FindOneAndUpdateOptions;
        return this.collection.updateOne(
            this.getUpsertFilter(osirisRequest),
            { $set: osirisRequest, $unset: this.deprecatedFieldsProjection },
            options,
        );
    }

    public async bulkUpsert(osirisRequests: OsirisRequestEntity[]): Promise<BulkUpsertResult> {
        const bulk: AnyBulkWriteOperation<OsirisRequestEntity>[] = osirisRequests.map(request => {
            return {
                updateOne: {
                    filter: this.getUpsertFilter(request),
                    update: { $set: request, $unset: this.deprecatedFieldsProjection },
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
            .find(
                this.toFilter({
                    $or: [{ "association.siret": siret.value }, { "beneficiaire.siret": siret.value }],
                }),
                this.findProjection,
            )
            .toArray();
    }

    public findByRna(rna: Rna): Promise<OsirisRequestEntity[]> {
        return this.collection
            .find(
                this.toFilter({
                    $or: [{ "association.rna": rna.value }, { "beneficiaire.rna": rna.value }],
                }),
                this.findProjection,
            )
            .toArray();
    }

    public async findBySiren(siren: Siren): Promise<OsirisRequestEntity[]> {
        return this.collection
            .find(
                this.toFilter({
                    $or: [
                        { "association.siret": new RegExp(`^${siren.value}\\d{5}`) },
                        { "beneficiaire.siret": new RegExp(`^${siren.value}\\d{5}`) },
                    ],
                }),
                this.findProjection,
            )
            .toArray();
    }

    // Used by integration tests and read-side features. Do not use this method for legacy migration because it excludes deprecated fields.
    public findAll(): Promise<OsirisRequestEntity[]> {
        return this.collection.find({}, this.findProjection).toArray();
    }
}

const osirisRequestAdapter: OsirisRequestAdapter = new OsirisRequestAdapter();
export default osirisRequestAdapter;
