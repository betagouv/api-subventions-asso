import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import MongoAdapter from "../MongoAdapter";
import StateBudgetProgramDbo from "./StateBudgetProgramDbo";
import StateBudgetProgramMapper from "./state-budget-program.mapper";
import { StateBudgetProgramPort } from "./state-budget-program.port";

/**
 * Represents a data provider for state budget programs.
 */
export class StateBudgetProgramAdapter extends MongoAdapter<StateBudgetProgramDbo> implements StateBudgetProgramPort {
    collectionName = "state-budget-program";

    /**
     * Creates indexes for the state budget program collection.
     */
    public createIndexes(): void {
        this.collection.createIndex({ code: 1 }, { unique: true });
    }

    /**
     * Finds a state budget program by its code.
     * @param code - The code of the state budget program.
     * @returns A promise that resolves to the state budget program entity.
     * @throws An error if the state budget program with the specified code is not found.
     */
    public async findByCode(code: string): Promise<StateBudgetProgramEntity> {
        const dbo = await this.collection.findOne({ code });

        if (!dbo) throw new Error(`StateBudgetProgram with code ${code} not found`);

        return StateBudgetProgramMapper.toEntity(dbo);
    }

    /**
     * Replaces all state budget programs with the specified programs.
     * @param programs - The state budget programs to replace with.
     * @returns A promise that resolves when the replacement is complete.
     */
    public async replace(programs: StateBudgetProgramEntity[]): Promise<void> {
        await this.collection.deleteMany({});
        await this.collection.insertMany(programs.map(program => StateBudgetProgramMapper.toDbo(program)));
    }

    /**
     * Finds all state budget programs.
     * @returns A promise that resolves to an array of state budget program entities.
     */
    public async findAll(): Promise<StateBudgetProgramEntity[]> {
        return this.collection.find().map(StateBudgetProgramMapper.toEntity).toArray();
    }
}

const stateBudgetProgramAdapter = new StateBudgetProgramAdapter();
export default stateBudgetProgramAdapter;
