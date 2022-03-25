import MigrationRepository from "../../../../shared/MigrationRepository";
import EntrepriseSirenEntity from "../entities/EntrepriseSirenEntity";

export class EntrepriseSirenRepository extends MigrationRepository<EntrepriseSirenEntity> {

    readonly collectionName = "datagouv-entreprise-siren";

    readonly collectionImportName = "datagouv-entreprise-siren-IMPORT"

    async insertMany(enities: EntrepriseSirenEntity[], dropedDb = false) {
        if (dropedDb) {
            return this.db.collection<EntrepriseSirenEntity>(this.collectionImportName).insertMany(enities, { ordered: false });
        }

        return this.collection.insertMany(enities, { ordered: false });
    }

    public async switchCollection() {
        const collectionExist = (await this.db.listCollections().toArray())
            .find(c => c.name === this.collectionName);

        if (collectionExist) await this.collection.rename(this.collectionName + "-OLD");
        
        await this.db.collection(this.collectionImportName).rename(this.collectionName);
        
        if (collectionExist) await this.db.collection(this.collectionName + "-OLD").drop();
    }
}

const entrepriseSirenRepository = new EntrepriseSirenRepository();

export default entrepriseSirenRepository;
