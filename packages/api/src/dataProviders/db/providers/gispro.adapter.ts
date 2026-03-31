import MongoAdapter from "../MongoAdapter";
import GisproEntity from "../../../modules/providers/dauphin-gispro/@types/GisproEntity";
import { GisproPort } from "./gispro.port";

export class GisproAdapter extends MongoAdapter<GisproEntity> implements GisproPort {
    public collectionName = "gispro";

    public async createIndexes() {
        this.collection.createIndex({ codeActionDossier: 1 });
        this.collection.createIndex({ codeProjet: 1 });
    }

    async insertMany(entities: GisproEntity[]): Promise<void> {
        await this.collection.insertMany(entities, { ordered: false });
    }

    /*
     * @hidden private use for tests
     * */
    findAll(): Promise<GisproEntity[]> {
        return this.collection.find({}).toArray();
    }
}

const gisproAdapter = new GisproAdapter();
export default gisproAdapter;
