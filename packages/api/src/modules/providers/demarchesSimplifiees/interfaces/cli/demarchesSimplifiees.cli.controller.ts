import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import demarchesSimplifieesService from "../../demarchesSimplifiees.service";
import configurationsService from "../../../../configurations/configurations.service";
import DemarchesSimplifieesMapperEntity from "../../entities/DemarchesSimplifieesMapperEntity";

@StaticImplements<CliStaticInterface>()
export default class DemarchesSimplifieesCliController {
    static cmdName = "demarche-simplifiees";

    async updateAll() {
        await demarchesSimplifieesService.updateAllForms();
    }

    async insertSchema(schemaJsonPath) {
        if (!fs.existsSync(schemaJsonPath)) {
            throw new Error("The schema json file are not found on path: " + schemaJsonPath);
        }

        const jsonSchema = fs.readFileSync(schemaJsonPath).toString();

        const schema = JSON.parse(jsonSchema) as DemarchesSimplifieesMapperEntity;
        await configurationsService.addAcceptedDemarchesSimplifieesFormIds(schema.demarcheId);
        await demarchesSimplifieesService.addSchemaMapper(schema);
    }
}
