import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";

export interface StateBudgetProgramPort {
    createIndexes(): void;

    findByCode(code: string): Promise<StateBudgetProgramEntity>;
    replace(programs: StateBudgetProgramEntity[]): Promise<void>;
    findAll(): Promise<StateBudgetProgramEntity[]>;
}
