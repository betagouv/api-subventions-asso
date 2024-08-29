import * as fs from "fs";
import path from "path";
import csvSyncStringifier = require("csv-stringify/sync");
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import { asyncForEach } from "../../shared/helpers/ArrayHelper";
import * as CliHelper from "../../shared/helpers/CliHelper";
import CliController from "../../shared/CliController";
import subventiaService from "../../modules/providers/subventia/subventia.service";
import { SubventiaDbo } from "../../modules/providers/subventia/@types/subventia.entity";
import { ParsedDataWithProblem } from "../../modules/providers/subventia/validators/@types/Validation";
import { DEV } from "../../configurations/env.conf";

@StaticImplements<CliStaticInterface>()
export default class SubventiaCli extends CliController {
    static cmdName = "subventia";

    protected _providerIdToLog = subventiaService.provider.id;

    protected logFileParsePath = "./logs/subventia.parse.log.txt";
    static errorsFolderName = "./importErrors";

    protected async _parse(file: string, logs, exportDate) {
        const processedData = subventiaService.processSubventiaData(file, new Date(exportDate));
        const entities = processedData.applications;
        const errors = processedData.invalids;
        await Promise.all([this.persistEntities(entities), this.exportErrors(errors, file)]);
        console.log("Subventia data parsed");
    }

    private async persistEntities(entities: Omit<SubventiaDbo, "_id">[]) {
        const totalEntities = entities.length;

        await asyncForEach(entities, async (entity, index) => {
            CliHelper.printProgress(index + 1, totalEntities);
            await subventiaService.createEntity(entity);
        });
    }

    private async exportErrors(errors: ParsedDataWithProblem[], file: string) {
        if (!DEV || !errors.length) return;
        const fileName = path.basename(file);
        if (!fs.existsSync(SubventiaCli.errorsFolderName)) fs.mkdirSync(SubventiaCli.errorsFolderName);
        const outputPath = path.join(SubventiaCli.errorsFolderName, fileName + "-Errors.csv");

        const csvContent = csvSyncStringifier.stringify(errors, { header: true });

        try {
            fs.writeFileSync(outputPath, csvContent, { flag: "w", encoding: "utf-8" });
        } catch (err) {
            if (err) console.log("Can't write to file");
            else console.log("fields with errors exported in " + path.resolve(outputPath));
        }
        console.log("file written");
    }
}
