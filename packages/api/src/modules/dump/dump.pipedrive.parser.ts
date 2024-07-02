import { AdminTerritorialLevel, AgentJobTypeEnum, AgentTypeEnum } from "dto";
import * as ParserHelper from "../../shared/helpers/ParserHelper";
import { indexDataByPathObject } from "../../shared/helpers/ParserHelper";

export default class DumpPipedriveParser {
    static parse(content: Buffer) {
        console.log("Open and read file ...");
        const pages = ParserHelper.xlsParse(content);
        console.log("Read file end");
        return DumpPipedriveParser.adapts(pages);
    }

    private static adapts(excelPages: (string | number)[][][]) {
        const page = excelPages[0];
        const headerRow = page.splice(0, 1)[0] as string[];
        console.log("Map rows to entities...");
        const entities = page.map(userRow => ParserHelper.linkHeaderToData(headerRow, userRow));
        return entities.map(pipedriveUser => indexDataByPathObject(DumpPipedriveParser.pathObject, pipedriveUser)); // TODO check adapter types
    }

    private static pathObject = {
        email: { path: ["Email"] },
        firstName: { path: ["FirstName"] },
        lastName: { path: ["LastName"] },
        agentType: {
            path: ["AgentType"],
            adapter(agentTypeLabel: string | undefined) {
                if (agentTypeLabel === "Administration déconcentrée") return AgentTypeEnum.DECONCENTRATED_ADMIN;
                if (agentTypeLabel === "Opérateur") return AgentTypeEnum.OPERATOR;
                if (agentTypeLabel === "Collectivité territoriale") return AgentTypeEnum.TERRITORIAL_COLLECTIVITY;
                if (agentTypeLabel === "Administration centrale") return AgentTypeEnum.CENTRAL_ADMIN;
                return undefined;
            },
        },
        jobType: {
            path: ["JobType"],
            adapter(jobTypeLabels: string | undefined) {
                if (!jobTypeLabels) return [];
                const adaptOnLabel = (jobTypeLabel: string) => {
                    const trimmed = jobTypeLabel.trim();
                    if (trimmed === "Gestionnaire") return AgentJobTypeEnum.ADMINISTRATOR;
                    if (trimmed === "Expert métier") return AgentJobTypeEnum.EXPERT;
                    if (trimmed === "Chef de service") return AgentJobTypeEnum.SERVICE_HEAD;
                    if (trimmed === "Contrôleur") return AgentJobTypeEnum.CONTROLLER;
                    if (trimmed === "Autre") return AgentJobTypeEnum.OTHER;
                    return undefined;
                };
                return jobTypeLabels.split(",").map(adaptOnLabel).filter(Boolean);
            },
        },
        service: { path: ["Personne - Service"] },
        phoneNumber: {
            path: ["PhoneNumber"],
            adapter(phoneNumber: string | number | undefined) {
                if (typeof phoneNumber === "string") return phoneNumber;
                if (typeof phoneNumber === "number") return `0${phoneNumber}`;
                return undefined;
            },
        },
        structure: { path: ["Structure"] },
        decentralizedLevel: {
            path: ["DecentralizedLevel"],
            adapter(territorialLevel: string | undefined) {
                if (territorialLevel === "Régionale") return AdminTerritorialLevel.REGIONAL;
                if (territorialLevel === "Départementale") return AdminTerritorialLevel.DEPARTMENTAL;
                if (territorialLevel === "Interrégionale") return AdminTerritorialLevel.INTERREGIONAL;
                if (territorialLevel === "Interdépartementale") return AdminTerritorialLevel.INTERDEPARTMENTAL;
                if (territorialLevel === "Collectivité d'outre-mer à statut particulier")
                    return AdminTerritorialLevel.OVERSEAS;
                return undefined;
            },
        },
        region: { path: ["Personne - Région"] },
        department: { path: ["Personne - Département"] },
    };
}
