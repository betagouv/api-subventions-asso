import MongoPort from "../../../shared/MongoPort";
import GisproEntity from "../../../modules/providers/dauphin-gispro/@types/GisproEntity";

export class GisproPort extends MongoPort<GisproEntity> {
    public collectionName = "gispro";

    public createIndexes(): void {
        this.collection.createIndex({ codeActionDossier: 1 });
        this.collection.createIndex({ codeProjet: 1 });
    }

    insertMany(entities: GisproEntity[]) {
        return this.collection.insertMany(entities, { ordered: false });
    }

    /*
     * @hidden private use for tests
     * */
    findAll() {
        return this.collection.find({}).toArray();
    }
}

const gisproPort = new GisproPort();
export default gisproPort;
