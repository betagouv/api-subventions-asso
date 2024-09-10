import ApplicationsFlatEntity from "../../../entities/ApplicationsFlatEntity";
import MongoRepository from "../../../shared/MongoRepository";
import ApplicationsFlatAdapter from "./ApplicationsFlat.adapter";
import ApplicationsFlatDbo from "./ApplicationsFlatDbo";

export class ApplicationsFlatPort extends MongoRepository<ApplicationsFlatDbo> {
    collectionName = "applications-flat";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siret: 1, dateOperation: 1 });
    }

    public async insertOne(entity: ApplicationsFlatEntity) {
        return await this.collection.insertOne(ApplicationsFlatAdapter.toDbo(entity));
    }

    public async deleteAll() {
        await this.collection.deleteMany({});
    }
}

const applicationsFlatPort = new ApplicationsFlatPort();
export default applicationsFlatPort;
