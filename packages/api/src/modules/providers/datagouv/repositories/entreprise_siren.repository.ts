import { Siren } from "@api-subventions-asso/dto";
import MigrationRepository from "../../../../shared/MigrationRepository";
import EntrepriseSirenEntity from "../entities/EntrepriseSirenEntity";

export class EntrepriseSirenRepository extends MigrationRepository<EntrepriseSirenEntity> {

    readonly collectionName = "datagouv-entreprise-siren";

    readonly collectionImportName = "datagouv-entreprise-siren-IMPORT"

    async insertMany(entities: EntrepriseSirenEntity[], dropedDb = false) {
        if (dropedDb) {
            return this.db.collection<EntrepriseSirenEntity>(this.collectionImportName).insertMany(entities, { ordered: false });
        }

        return this.collection.insertMany(entities, { ordered: false });
    }

    async create(entity: EntrepriseSirenEntity) {
        return this.collection.insertOne(entity);
    }

    public async replaceCollection() {
        const oldCollectionExist = (await this.db.listCollections().toArray())
            .find(c => c.name === this.collectionName);
        const newCollectionExist = (await this.db.listCollections().toArray())
            .find(c => c.name === this.collectionImportName);

        if (oldCollectionExist) await this.collection.rename(this.collectionName + "-OLD");

        if (newCollectionExist) await this.db.collection(this.collectionImportName).rename(this.collectionName);

        if (oldCollectionExist) await this.db.collection(this.collectionName + "-OLD").drop();
    }

    public async findOne(siren: Siren) {
        return this.collection.findOne({ _id: siren });
    }
}

const entrepriseSirenRepository = new EntrepriseSirenRepository();

export default entrepriseSirenRepository;
