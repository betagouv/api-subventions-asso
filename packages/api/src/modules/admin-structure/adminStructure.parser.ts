import { AdminTerritorialLevel, AgentTypeEnum } from "dto";
import { BadRequestError } from "../../shared/errors/httpErrors";
import { GenericParser } from "../../shared/GenericParser";
import AdminStructureEntity from "./entities/AdminStructureEntity";

/*
 * This parser is used to populate admin-structures collection from this doc :
 * https://docs.google.com/spreadsheets/d/1zAjTLwur9jw0VMlMYi77rLgw4F1PbCtII3Z86fFYBGo/edit
 * through an xls export
 * The collection is a list of the administration structures and serves as choice list
 * for step 3 question "Quelle est votre administration"
 * The choice is actually the last column, but they are meant to be filtered by columns 1
 * and 2 (column 2 is only used if column 1 choice is "DECONCENTRATED_ADMIN")
 */
export default class AdminStructureParser {
    private static readonly csvToAgentTypeEnum: { [key: string]: AgentTypeEnum } = {
        Opérateur: AgentTypeEnum.OPERATOR,
        "Administration centrale": AgentTypeEnum.CENTRAL_ADMIN,
        "Collectivité territoriale": AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
        "Administration déconcentrée": AgentTypeEnum.DECONCENTRATED_ADMIN,
    };

    private static readonly csvToTerritoryLevel: { [key: string]: AdminTerritorialLevel | undefined } = {
        Départementale: AdminTerritorialLevel.DEPARTMENTAL,
        Régionale: AdminTerritorialLevel.REGIONAL,
        "Collectivité d'outre-mer à statut particulier": AdminTerritorialLevel.OVERSEAS,
    };

    public static parseXls(content: Buffer): AdminStructureEntity[] {
        const data = GenericParser.xlsParse(content)[0]; // single page
        const rows = data.slice(1);

        const entities: AdminStructureEntity[] = [];
        for (const row of rows) {
            entities.push(
                new AdminStructureEntity(
                    AdminStructureParser.exportNameToAgentType(row[0]),
                    AdminStructureParser.exportNameToTerritoryLevel(row[1]),
                    row[2],
                ),
            );
        }

        return entities;
    }

    private static exportNameToAgentType(value: string) {
        if (AdminStructureParser.csvToAgentTypeEnum[value]) return AdminStructureParser.csvToAgentTypeEnum[value];
        throw new BadRequestError(
            `Valeur de première colonne "${value}" non conforme, mettre à jour \`csvNameToAgentType\` dans \`adminStructure.parser\` ou la valeur dans le document source.`,
        );
    }

    private static exportNameToTerritoryLevel(value: string): AdminTerritorialLevel | undefined {
        if (AdminStructureParser.csvToTerritoryLevel[value]) return AdminStructureParser.csvToTerritoryLevel[value];
        console.warn(
            `Valeur de seconde colonne "${value}" non conforme, mettre à jour \`csvNameToTerritoryLevel\` dans \`adminStructure.parser\` ou la valeur dans le document source.`,
        );
    }
}
