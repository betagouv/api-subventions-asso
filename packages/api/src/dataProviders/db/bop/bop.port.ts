import MongoRepository from "../../../shared/MongoRepository";
import BopDbo from "./BopDbo";

export class BopPort extends MongoRepository<BopDbo> {
    collectionName = "bop";

    public createIndexes(): void {
        this.collection.createIndex({ code: 1 }, { unique: true });
    }

    public findByCode(code: string): Promise<BopDbo> {
        return this.collection.find({ code }).toArray()[0];
    }

    public async replace(bops: BopDbo[]) {
        await this.collection.deleteMany({});
        return this.collection.insertMany(bops);
    }
}

const bopPort = new BopPort();
export default bopPort;
