import { Siren, Siret } from "@api-subventions-asso/dto";
import { Collection, ObjectId } from "mongodb";
import MigrationRepository from "../../../../shared/MigrationRepository";
import FonjepSubventionEntity from "../entities/FonjepSubventionEntity";

export class FonjepSubventionRepository extends MigrationRepository<FonjepSubventionEntity> {
    readonly collectionName = "fonjepSubvention";
    private tmpCollectionEnabled = false;

    async createIndexes() {
        await this.collection.createIndex({ "legalInformations.siret": 1 });
    }

    async create(entity: FonjepSubventionEntity) {
        return await this.collection.insertOne(entity);
    }

    findBySiret(siret: Siret) {
        return this.collection
            .find({
                "legalInformations.siret": siret,
            })
            .toArray();
    }

    findBySiren(siren: Siren) {
        return this.collection
            .find({
                "legalInformations.siret": new RegExp(`^${siren}\\d{5}`),
            })
            .toArray();
    }

    async findById(id: string) {
        return this.collection.findOne({ _id: new ObjectId(id) });
    }

    async drop() {
        return this.collection.drop();
    }

    async rename(name: string) {
        return this.collection.rename(name);
    }

    useTemporyCollection(active) {
        this.tmpCollectionEnabled = active;
    }

    async applyTemporyCollection() {
        this.useTemporyCollection(false);
        await this.collection.rename(this.collectionName + "-OLD");
        this.useTemporyCollection(true);
        await this.collection.rename(this.collectionName);

        this.useTemporyCollection(false);

        await this.createIndexes();

        await this.db.collection(this.collectionName + "-OLD").drop();
    }

    protected get collection(): Collection<FonjepSubventionEntity> {
        if (this.tmpCollectionEnabled) {
            return this.db.collection<FonjepSubventionEntity>(this.collectionName + "-tmp-collection");
        }

        return super.collection;
    }
}

const fonjepSubventionRepository = new FonjepSubventionRepository();

export default fonjepSubventionRepository;
