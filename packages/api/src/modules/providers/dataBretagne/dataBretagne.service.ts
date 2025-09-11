import { ProviderEnum } from "../../../@enums/ProviderEnum";
import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
import stateBudgetProgramPort from "../../../dataProviders/db/state-budget-program/stateBudgetProgram.port";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import ProviderCore from "../ProviderCore";
import MinistryEntity from "../../../entities/MinistryEntity";
import dataLogService from "../../data-log/dataLog.service";
import {
    DataBretagneRecords,
    FonctionalDomainsRecord,
    MinistriesRecord,
    ProgramsRecord,
    ProgramsRefRecord,
} from "./@types/DataBretagne";

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
        this.programsByCode = await dataBretagneService.getProgramsRecord();
    }

    async login() {
        return dataBretagnePort.login();
    }

    async resyncPrograms() {
        await dataBretagnePort.login();
        const programs = await dataBretagnePort.getStateBudgetPrograms();
        // do not replace programs if empty
        if (!programs || !programs.length) throw new Error("Unhandled error from API Data Bretagne");
        await stateBudgetProgramPort.replace(programs);
        await dataLogService.addLog(dataBretagneService.meta.id, "api", new Date());
    }

    async getAllDataRecords(): Promise<DataBretagneRecords> {
        await dataBretagneService.login();
        const programs = await dataBretagneService.getProgramsRecord();
        const ministries = await dataBretagneService.getMinistriesRecord();
        const fonctionalDomains = await dataBretagneService.getFonctionalDomainsRecord();
        const programsRef = await dataBretagneService.getProgramsRefRecord();

        return { programs, ministries, fonctionalDomains, programsRef };
    }

    /**
     * Retrieves the programs record from the state budget.
     * @returns A promise that resolves to a record of state budget program entities, where the keys are program codes.
     */
    async getProgramsRecord(): Promise<ProgramsRecord> {
        const programs = await stateBudgetProgramPort.findAll();
        return programs.reduce((acc, currentLine) => {
            acc[currentLine.code_programme] = currentLine;
            return acc;
        }, {});
    }

    async getMinistriesRecord(): Promise<MinistriesRecord> {
        const ministries = await dataBretagnePort.getMinistry();
        return ministries.reduce((acc, currentLine) => {
            acc[currentLine.code_ministere] = currentLine;
            return acc;
        }, {});
    }

    async getFonctionalDomainsRecord(): Promise<FonctionalDomainsRecord> {
        const fonctionalDomains = await dataBretagnePort.getDomaineFonctionnel();
        return fonctionalDomains.reduce((acc, currentLine) => {
            acc[currentLine.code_action] = currentLine;
            return acc;
        }, {});
    }

    async getProgramsRefRecord(): Promise<ProgramsRefRecord> {
        const refsProgram = await dataBretagnePort.getRefProgrammation();

        return refsProgram.reduce((acc, currentLine) => {
            acc[currentLine.code_activite] = currentLine;
            return acc;
        }, {});
    }

    public getMinistryEntity(program: StateBudgetProgramEntity, ministries: Record<string, MinistryEntity>) {
        const entity = ministries[program?.code_ministere];
        if (!entity) {
            console.error(`Ministry not found for program code: ${program.code_ministere}`);
            return null;
        }
        return entity;
    }
}
const dataBretagneService = new DataBretagneService();
export default dataBretagneService;
