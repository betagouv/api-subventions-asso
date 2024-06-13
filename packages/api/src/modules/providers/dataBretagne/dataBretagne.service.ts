import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
import stateBudgetProgramPort from "../../../dataProviders/db/state-budget-program/stateBudgetProgram.port";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import DataBretagneProgrammeAdapter from "./DataBretagneProgrammeAdapter";

/**
 * Service for interacting with the Data Bretagne API.
 */
class DataBretagneService {
    async login() {
        return dataBretagnePort.login();
    }

    async resyncPrograms() {
        await dataBretagnePort.login();
        const programs = await dataBretagnePort.getStateBudgetPrograms();
        // do not replace programs if empty
        if (!programs || !programs.length) throw new Error("Unhandled error from API Data Bretagne");
        return stateBudgetProgramPort.replace(programs.map(program => DataBretagneProgrammeAdapter.toEntity(program)));
    }

    async findPrograms(): Promise<StateBudgetProgramEntity[]> {
        return stateBudgetProgramPort.find();
    }
}
const dataBretagneService = new DataBretagneService();
export default dataBretagneService;
