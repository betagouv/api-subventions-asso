import fs from "fs";

import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import demarchesSimplifieesService from "../../modules/providers/demarchesSimplifiees/demarchesSimplifiees.service";
import DemarchesSimplifieesSchemaEntity from "../../modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesSchemaEntity";
import { DemarchesSimplifieesSchemaSeed } from "../../modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesSchemaSeedEntity";

@StaticImplements<CliStaticInterface>()
export default class DemarchesSimplifieesCli {
    static cmdName = "demarches-simplifiees";

    async updateAll() {
        await demarchesSimplifieesService.updateAllForms();
    }

    async insertSchema(schemaJsonPath: string) {
        if (!fs.existsSync(schemaJsonPath))
            throw new Error("The schema json file are not found on path: " + schemaJsonPath);

        const jsonSchema = fs.readFileSync(schemaJsonPath).toString();

        const schema = JSON.parse(jsonSchema) as DemarchesSimplifieesSchemaEntity;
        await demarchesSimplifieesService.addSchema(schema);
    }

    async generateSchema(schemaModelJsonPath: string, demarcheIdStr: number, testDev = false) {
        const demarcheId = Number(demarcheIdStr);
        if (!fs.existsSync(schemaModelJsonPath))
            throw new Error("The schema JSON file is not found on path: " + schemaModelJsonPath);

        const jsonSchema = fs.readFileSync(schemaModelJsonPath).toString();
        const schemaSeed = JSON.parse(jsonSchema) as DemarchesSimplifieesSchemaSeed;
        const schema = await demarchesSimplifieesService.buildFullSchema(schemaSeed, demarcheId);

        if (testDev)
            fs.writeFileSync("../../../schemaTest.json", JSON.stringify(schema), {
                flag: "w",
                encoding: "utf-8",
            });
        else await demarchesSimplifieesService.addSchema(schema);
    }
}
