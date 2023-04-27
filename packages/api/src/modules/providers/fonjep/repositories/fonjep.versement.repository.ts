import { Siren, Siret } from "@api-subventions-asso/dto";
import { Collection } from "mongodb";
import MigrationRepository from "../../../../shared/MigrationRepository";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";

export class FonjepVersementRepository extends MigrationRepository<FonjepVersementEntity> {
    readonly collectionName = "fonjepVersement";
    private tmpCollectionEnabled = false;

    async createIndexes() {
        await this.collection.createIndex({ "indexedInformations.code_poste": 1 });
        await this.collection.createIndex({ "legalInformations.siret": 1 });
    }

    create(entity: FonjepVersementEntity) {
        return this.collection.insertOne(entity);
    }

    findByCodePoste(code: string) {
        return this.collection.find({ "indexedInformations.code_poste": code }).toArray();
    }

    findBySiret(siret: Siret) {
        return this.collection.find({ "legalInformations.siret": siret }).toArray();
    }

    public findBySiren(siren: Siren) {
        return this.collection
            .find({
                "legalInformations.siret": new RegExp(`^${siren}\\d{5}`),
            })
            .toArray();
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

    protected get collection(): Collection<FonjepVersementEntity> {
        if (this.tmpCollectionEnabled) {
            return this.db.collection<FonjepVersementEntity>(this.collectionName + "-tmp-collection");
        }

        return super.collection;
    }
}

const fonjepVersementRepository = new FonjepVersementRepository();
export default fonjepVersementRepository;
