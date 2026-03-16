import MongoPort from "../../../../shared/MongoPort";
import { GeoDbo } from "../../../../modules/providers/geoApi/@types/geo.types";

export class GeoAdapter extends MongoPort<GeoDbo> {
    collectionName = "geo";

    async createIndexes() {
        await this.collection.createIndex({ departmentName: 1 });
    }

    insertMany(entities) {
        return this.collection.insertMany(entities, { ordered: false });
    }

    deleteAll() {
        return this.collection.deleteMany({});
    }

    findByDepartmentName(departmentName: string): Promise<GeoDbo | null> {
        return this.collection.findOne({ departmentName });
    }
}

const geoAdapter = new GeoAdapter();
export default geoAdapter;
