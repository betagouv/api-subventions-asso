import MongoRepository from "../../../shared/MongoRepository";
import ProgrammeDbo from "./ProgrammeDbo";

export class ProgrammePort extends MongoRepository<ProgrammeDbo> {
    collectionName = "programme";

    public createIndexes(): void {
        this.collection.createIndex({ code: 1 }, { unique: true });
    }

    public findByCode(code: string): Promise<ProgrammeDbo> {
        return this.collection.find({ code }).toArray()[0];
    }

    public async replace(programmes: ProgrammeDbo[]) {
        await this.collection.deleteMany({});
        return this.collection.insertMany(programmes);
    }
}

const programmePort = new ProgrammePort();
export default programmePort;
