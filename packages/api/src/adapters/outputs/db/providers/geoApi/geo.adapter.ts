import MongoAdapter from "../../MongoAdapter";
import { GeoDbo } from "../../../../../modules/providers/geoApi/@types/geo.types";
import { GeoApiPort } from "./geo.port";

export class GeoAdapter extends MongoAdapter<GeoDbo> implements GeoApiPort {
    collectionName = "geo";

    async createIndexes(): Promise<void> {
        await this.collection.createIndex({ departmentName: 1 });
    }

    async insertMany(entities): Promise<void> {
        await this.collection.insertMany(entities, { ordered: false });
    }

    async deleteAll(): Promise<void> {
        await this.collection.deleteMany({});
    }

    findByDepartmentName(departmentName: string): Promise<GeoDbo | null> {
        return this.collection.findOne({ departmentName });
    }
}

const geoAdapter = new GeoAdapter();
export default geoAdapter;
