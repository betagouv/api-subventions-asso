import { AgentTypeEnum } from "@api-subventions-asso/dto";
import { BadRequestError } from "../../shared/errors/httpErrors";
import * as ParseHelper from "../../shared/helpers/ParserHelper";
import AdminStructureEntity from "./entities/AdminStructureEntity";

/*
 * This parser is used to populate admin-structures collection from this doc :
 * https://docs.google.com/spreadsheets/d/1zAjTLwur9jw0VMlMYi77rLgw4F1PbCtII3Z86fFYBGo/edit
 * through an xls export
 * The collection is a list of the administration structures and serves as choice list
 * for step 3 question "Quell est votre administration"
 * The choice is actually the last column but they are meant to be filtered by columns 1
 * and 2 (column 2 is only used if column 1 choice is "DECONCENTRATED_ADMIN")
 */
export default class AdminStructureParser {
    private static readonly csvToEnum = {
        Opérateur: AgentTypeEnum.OPERATOR,
        "Administration centrale": AgentTypeEnum.CENTRAL_ADMIN,
        "Collectivité territoriale": AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
        "Administration déconcentrée": AgentTypeEnum.DECONCENTRATED_ADMIN,
    };

    public static parseXls(content: Buffer): AdminStructureEntity[] {
        const data = ParseHelper.xlsParse(content)[0]; // single page
        const rows = data.slice(1);

        const entities: AdminStructureEntity[] = [];
        for (const row of rows) {
            entities.push(new AdminStructureEntity(AdminStructureParser.exportNameToAgentType(row[0]), row[1], row[2]));
        }

        return entities;
    }

    public static exportNameToAgentType(value: string) {
        if (AdminStructureParser.csvToEnum[value]) return AdminStructureParser.csvToEnum[value];
        throw new BadRequestError(
            `Valeur de première colonne "${value}" non conforme, mettre à jour \`csvNameToAgentType\` dans \`adminStructure.parser\`.`,
        );
    }
}
