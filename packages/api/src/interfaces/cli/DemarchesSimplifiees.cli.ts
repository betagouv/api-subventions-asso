import fs from "fs";

import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import demarchesSimplifieesService from "../../modules/providers/demarchesSimplifiees/demarchesSimplifiees.service";
import DemarchesSimplifieesMapperEntity from "../../modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesMapperEntity";

@StaticImplements<CliStaticInterface>()
export default class DemarchesSimplifieesCli {
    static cmdName = "demarches-simplifiees";

    async updateAll() {
        await demarchesSimplifieesService.updateAllForms();
    }

    async insertSchema(schemaJsonPath) {
        if (!fs.existsSync(schemaJsonPath)) {
            throw new Error("The schema json file are not found on path: " + schemaJsonPath);
        }

        const jsonSchema = fs.readFileSync(schemaJsonPath).toString();

        const schema = JSON.parse(jsonSchema) as DemarchesSimplifieesMapperEntity;
        await demarchesSimplifieesService.addSchemaMapper(schema);
    }
}
