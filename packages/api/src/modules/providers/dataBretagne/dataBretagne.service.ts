import { ProviderEnum } from "../../../@enums/ProviderEnum";
import dataBretagneAdapter from "../../../dataProviders/api/data-bretagne/data-bretagne.adapter";
import stateBudgetProgramAdapter from "../../../dataProviders/db/state-budget-program/state-budget-program.adapter";
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
    constructor() {
        super({
            name: "Data Bretagne",
            type: ProviderEnum.api,
            description: "Data Bretagne is the API for the state budget.",
            id: "data-bretagne",
        });
    }

    async login() {
        return dataBretagneAdapter.login();
    }

    async resyncPrograms() {
        await dataBretagneAdapter.login();
        const programs = await dataBretagneAdapter.getStateBudgetPrograms();
        // do not replace programs if empty
        if (!programs || !programs.length) throw new Error("Unhandled error from API Data Bretagne");
        await stateBudgetProgramAdapter.replace(programs);
        await dataLogService.addFromApi({
            providerId: dataBretagneService.meta.id,
            providerName: dataBretagneService.meta.name,
            editionDate: new Date(),
        });
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
        const programs = await stateBudgetProgramAdapter.findAll();
        return programs.reduce((acc, currentLine) => {
            acc[currentLine.code_programme] = currentLine;
            return acc;
        }, {});
    }

    async getMinistriesRecord(): Promise<MinistriesRecord> {
        const ministries = await dataBretagneAdapter.getMinistry();
        return ministries.reduce((acc, currentLine) => {
            acc[currentLine.code_ministere] = currentLine;
            return acc;
        }, {});
    }

    async getFonctionalDomainsRecord(): Promise<FonctionalDomainsRecord> {
        const fonctionalDomains = await dataBretagneAdapter.getDomaineFonctionnel();
        return fonctionalDomains.reduce((acc, currentLine) => {
            acc[currentLine.code_action] = currentLine;
            return acc;
        }, {});
    }

    async getProgramsRefRecord(): Promise<ProgramsRefRecord> {
        const refsProgram = await dataBretagneAdapter.getRefProgrammation();

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
