import { Siren } from "../../../../@types/Siren";
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

    public async replaceCollection() {
        const collectionExist = (await this.db.listCollections().toArray())
            .find(c => c.name === this.collectionName);

        if (collectionExist) await this.collection.rename(this.collectionName + "-OLD");
        
        await this.db.collection(this.collectionImportName).rename(this.collectionName);
        
        if (collectionExist) await this.db.collection(this.collectionName + "-OLD").drop();
    }

    public async findOne(siren: Siren) {
        return this.collection.findOne({ _id: siren });
    }
}

const entrepriseSirenRepository = new EntrepriseSirenRepository();

export default entrepriseSirenRepository;
