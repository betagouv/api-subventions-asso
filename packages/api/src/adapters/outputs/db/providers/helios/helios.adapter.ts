import HeliosEntity from "../../../../../modules/providers/helios/domain/helios.entity";
import MongoAdapter from "../../MongoAdapter";
import HeliosPort from "./helios.port";

class HeliosAdapter extends MongoAdapter<HeliosEntity> implements HeliosPort {
    readonly collectionName = "helios";

    public async createIndexes() {
        await this.collection.createIndexes([{ key: { id: 1 }, unique: true }]);
    }

    public async insertMany(entities: HeliosEntity[]) {
        await this.collection.insertMany(entities);
        return;
    }

    public async findAll() {
        return this.collection.find({}, { projection: { _id: 0 } }).toArray();
    }
}

const heliosAdapter = new HeliosAdapter();
export default heliosAdapter;
