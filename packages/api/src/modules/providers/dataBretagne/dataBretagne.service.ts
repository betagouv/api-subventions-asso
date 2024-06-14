import { ProviderEnum } from "../../../@enums/ProviderEnum";
import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
import stateBudgetProgramPort from "../../../dataProviders/db/state-budget-program/stateBudgetProgram.port";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import ProviderCore from "../ProviderCore";

/**
 * Service for interacting with the Data Bretagne API.
 */
class DataBretagneService extends ProviderCore {
    constructor() {
        super({
            name: "Data Bretagne",
            type: ProviderEnum.api,
            description: "Data Bretagne is the API for the state budget.",
            id: "data-bretagne",
        });
    }

    async login() {
        return dataBretagnePort.login();
    }

    async resyncPrograms() {
        await dataBretagnePort.login();
        const programs = await dataBretagnePort.getStateBudgetPrograms();
        // do not replace programs if empty
        if (!programs || !programs.length) throw new Error("Unhandled error from API Data Bretagne");
        return stateBudgetProgramPort.replace(programs);
    }

    /**
     * Retrieves the programs record from the state budget.
     * @returns A promise that resolves to a record of state budget program entities, where the keys are program codes.
     */
    async findProgramsRecord(): Promise<Record<number, StateBudgetProgramEntity>> {
        const programs = await stateBudgetProgramPort.findAll();

        return programs.reduce((acc, program) => {
            acc[program.code_programme] = program;
            return acc;
        }, {});
    }
}
const dataBretagneService = new DataBretagneService();
export default dataBretagneService;
