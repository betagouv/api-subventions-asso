import { Siret, Siren } from "dto";
import { FindOneAndUpdateOptions } from "mongodb";
import OsirisEvaluationEntity from "../entities/OsirisEvaluationEntity";
import MongoRepository from "../../../../shared/MongoRepository";

export class OsirisEvaluationRepository extends MongoRepository<OsirisEvaluationEntity> {
    readonly collectionName = "osiris-evaluation";

    public async findByActionId(actionId: string) {
        return this.collection.findOne({
            "indexedInformations.osirisActionId": actionId,
        });
    }

    public async add(request: OsirisEvaluationEntity) {
        await this.collection.insertOne(request);
        return request;
    }

    public async update(request: OsirisEvaluationEntity) {
        const options = { returnNewDocument: true, includeResultMetadata: true } as FindOneAndUpdateOptions;
        const { _id, ...requestWithoutId } = request;
        return (await this.collection.findOneAndUpdate(
            { "indexedInformations.osirisActionId": request.indexedInformations.osirisActionId },
            { $set: requestWithoutId },
            options,
            //@ts-expect-error -- mongo typing expects no metadata
        ))!.value as OsirisEvaluationEntity;
    }

    public findsBySiret(siret: Siret) {
        return this.collection
            .find({
                "legalInformations.siret": siret,
            })
            .toArray();
    }

    public findBySiren(siren: Siren) {
        return this.collection
            .find({
                "legalInformations.siret": new RegExp(`^${siren}\\d{5}`),
            })
            .toArray();
    }

    public cursorFind(query = {}) {
        return this.collection.find(query);
    }

    async createIndexes() {
        await this.collection.createIndex({ "indexedInformations.osirisActionId": 1 }, { unique: true });
        await this.collection.createIndex({ "legalInformations.siret": 1 });
    }
}

const osirisEvaluationRepository = new OsirisEvaluationRepository();

export default osirisEvaluationRepository;
