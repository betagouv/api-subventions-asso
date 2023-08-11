import { AgentTypeEnum } from "@api-subventions-asso/dto";
import { BadRequestError } from "../../shared/errors/httpErrors";
import * as ParseHelper from "../../shared/helpers/ParserHelper";
import AdminStructureEntity from "./entities/AdminStructureEntity";

export default class AdminStructureParser {
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
        const csvToEnum = {
            Opérateur: AgentTypeEnum.OPERATOR,
            "Administration centrale": AgentTypeEnum.CENTRAL_ADMIN,
            "Collectivité territoriale": AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
            "Administration déconcentrée": AgentTypeEnum.DECONCENTRATED_ADMIN,
        };
        if (csvToEnum[value]) return csvToEnum[value];
        throw new BadRequestError(
            `Valeur de première colonne "${value}" non conforme, mettre à jour \`csvNameToAgentType\` dans \`adminStructure.parser\`.`,
        );
    }
}
