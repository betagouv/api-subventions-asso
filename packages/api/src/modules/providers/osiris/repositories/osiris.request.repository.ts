import { FindOneAndUpdateOptions, ObjectId } from "mongodb";
import { Rna, Siren, Siret } from "dto";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import MongoRepository from "../../../../shared/MongoRepository";

export class OsirisRequestRepository extends MongoRepository<OsirisRequestEntity> {
    collectionName = "osiris-requests";

    async createIndexes() {
        await this.collection.createIndex({ "providerInformations.osirisId": 1 }, { unique: true });
        await this.collection.createIndex({ "legalInformations.rna": 1 });
        await this.collection.createIndex({ "legalInformations.siret": 1 });
    }

    public async add(osirisRequest: OsirisRequestEntity) {
        return this.collection.insertOne(osirisRequest);
    }

    public async update(osirisRequest: OsirisRequestEntity) {
        const options: FindOneAndUpdateOptions = { returnDocument: "after" };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...requestWithoutId } = osirisRequest;
        return (await this.collection.findOneAndUpdate(
            {
                "providerInformations.osirisId": osirisRequest.providerInformations.osirisId,
            },
            { $set: requestWithoutId },
            options,
        )) as OsirisRequestEntity;
    }

    public async findByMongoId(id: string): Promise<OsirisRequestEntity | null> {
        return this.collection.findOne({ _id: new ObjectId(id) });
    }

    public findByOsirisId(osirisId: string) {
        return this.collection.findOne({
            "providerInformations.osirisId": osirisId,
        }) as unknown as OsirisRequestEntity | null;
    }

    public findBySiret(siret: Siret) {
        return this.collection
            .find({
                "legalInformations.siret": siret,
            })
            .toArray();
    }

    public findByRna(rna: Rna) {
        return this.collection
            .find({
                "legalInformations.rna": rna,
            })
            .toArray();
    }

    public async findBySiren(siren: Siren) {
        return this.collection
            .find({
                "legalInformations.siret": new RegExp(`^${siren}\\d{5}`),
            })
            .toArray();
    }

    public cursorFindRequests(query = {}) {
        return this.collection.find(query);
    }
}

const osirisRequestRepository: OsirisRequestRepository = new OsirisRequestRepository();
export default osirisRequestRepository;
