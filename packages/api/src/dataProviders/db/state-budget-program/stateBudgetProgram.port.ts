import MongoRepository from "../../../shared/MongoRepository";
import StateBudgetProgramDbo from "./StateBudgetProgramDbo";

export class StateBudgetProgramPort extends MongoRepository<StateBudgetProgramDbo> {
    collectionName = "state-budget-program";

    public createIndexes(): void {
        this.collection.createIndex({ code: 1 }, { unique: true });
    }

    public findByCode(code: string): Promise<StateBudgetProgramDbo> {
        return this.collection.find({ code }).toArray()[0];
    }

    public async replace(program: StateBudgetProgramDbo[]) {
        await this.collection.deleteMany({});
        return this.collection.insertMany(program);
    }
}

const stateBudgetProgramPort = new StateBudgetProgramPort();
export default stateBudgetProgramPort;
