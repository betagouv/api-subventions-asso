import { ProviderEnum } from "../../../@enums/ProviderEnum";
import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
import stateBudgetProgramPort from "../../../dataProviders/db/state-budget-program/stateBudgetProgram.port";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import ProviderCore from "../ProviderCore";
import MinistryEntity from "../../../entities/MinistryEntity";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";

/**
 * Service for interacting with the Data Bretagne API.
 */
class DataBretagneService extends ProviderCore {
    programsByCode: Record<number, StateBudgetProgramEntity> = {};

    constructor() {
        super({
            name: "Data Bretagne",
            type: ProviderEnum.api,
            description: "Data Bretagne is the API for the state budget.",
            id: "data-bretagne",
        });
    }

    // QUICK WIN FROM DEVELOP REBASE FOR #2313 -- WE MAY WANT TO HANDLE THIS IN A BETTER WAY
    async init() {
        this.programsByCode = await dataBretagneService.findProgramsRecord();
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

        return programs.reduce((acc, currentLine) => {
            acc[currentLine.code_programme] = currentLine;
            return acc;
        }, {});
    }

    async getMinistriesRecord(): Promise<Record<string, MinistryEntity>> {
        await dataBretagnePort.login();
        const ministries = await dataBretagnePort.getMinistry();
        return ministries.reduce((acc, currentLine) => {
            acc[currentLine.code_ministere] = currentLine;
            return acc;
        }, {});
    }

    async getDomaineFonctRecord(): Promise<Record<string, DomaineFonctionnelEntity>> {
        await dataBretagnePort.login();
        const domainesFonct = await dataBretagnePort.getDomaineFonctionnel();

        return domainesFonct.reduce((acc, currentLine) => {
            acc[currentLine.code_action] = currentLine;
            return acc;
        }, {});
    }

    async getRefProgrammationRecord(): Promise<Record<string, RefProgrammationEntity>> {
        await dataBretagnePort.login();
        const refsProgram = await dataBretagnePort.getRefProgrammation();

        return refsProgram.reduce((acc, currentLine) => {
            acc[currentLine.code_activite] = currentLine;
            return acc;
        }, {});
    }
}
const dataBretagneService = new DataBretagneService();
export default dataBretagneService;
