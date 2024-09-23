import fs from "fs";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import ChorusParser from "../../modules/providers/chorus/chorus.parser";
import chorusService from "../../modules/providers/chorus/chorus.service";
import * as CliHelper from "../../shared/helpers/CliHelper";
import { asyncForEach } from "../../shared/helpers/ArrayHelper";
import CliController from "../../shared/CliController";
import ChorusLineEntity from "../../modules/providers/chorus/entities/ChorusLineEntity";

@StaticImplements<CliStaticInterface>()
export default class ChorusCli extends CliController {
    static cmdName = "chorus";

    protected logFileParsePath = "./logs/chorus.parse.log.txt";
    protected _providerIdToLog = chorusService.provider.id;
    protected batchSize = 1000;

    /**
     * Parse Chorus XLS files
     * @param file path to file
     * @param batchSize La taille des paquets envoyés à mongo coup par coup
     */
    protected async _parse(file: string, logger) {
        const doc1 = {
            "N° EJ": "2101766485",
            "Fournisseur payé (DP) CODE": "1000321116",
            "Fournisseur payé (DP)": "ASS GESTION REST DRFIP NORD PAS DE",
            "Branche CODE": "Z039",
            Branche: "Associations",
            "Code taxe 1": "34137166400010",
            "No TVA 3 (COM-RIDET ou TAHITI)": "#",
            "Référentiel de programmation CODE": "BG00/021701010523",
            "Référentiel de programmation": "Social restauration",
            Société: "NORP",
            "Exercice comptable": "2023",
            "N° DP": "100053424",
            "Date de dernière opération sur la DP": 45100,
            "Centre financier CODE": "BG00/0217-SGAC-ASPR",
            "Centre financier": "Action Soc et  PRP",
            "Domaine fonctionnel CODE": "0217-07-05",
            "Domaine fonctionnel": "Moyens HT2 RH",
            "Montant payé": 110.94,
        };

        const doc2 = {
            "N° EJ": "2101766485",
            "Fournisseur payé (DP) CODE": "1000321116",
            "Fournisseur payé (DP)": "ASS GESTION REST DRFIP NORD PAS DE",
            "Branche CODE": "Z039",
            Branche: "Associations",
            "Code taxe 1": "34137166400010",
            "No TVA 3 (COM-RIDET ou TAHITI)": "#",
            "Référentiel de programmation CODE": "BG00/02160401012A",
            "Référentiel de programmation": "Act°soc : restaurati",
            Société: "NORP",
            "Exercice comptable": "2023",
            "N° DP": "100053424",
            "Date de dernière opération sur la DP": 45100,
            "Centre financier CODE": "BG00/0216-CPRH-CASR",
            "Centre financier": "0216-CPRH-CASR",
            "Domaine fonctionnel CODE": "0216-04-01",
            "Domaine fonctionnel": "Action sociale : offre de",
            "Montant payé": 278.96,
        };

        if (typeof file !== "string") {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        console.info("\nStart parse file: ", file);
        logger.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        const entities = ChorusParser.parse(fileContent);
        const totalEntities = entities.length;

        console.info(`\n${totalEntities} valid entities found in file.`);

        console.info("Start register in database ...");

        const batchNumber = Math.ceil(totalEntities / this.batchSize);
        const batchs: ChorusLineEntity[][] = [];

        for (let i = 0; i < batchNumber; i++) {
            batchs.push(entities.splice(-this.batchSize));
        }

        const finalResult = {
            created: 0,
            rejected: 0,
            duplicates: 0,
        };

        await asyncForEach(batchs, async (batch, index) => {
            CliHelper.printProgress(index * 1000, totalEntities);
            const result = await chorusService.insertBatchChorusLine(batch);
            finalResult.created += result.created;
            finalResult.rejected += result.rejected;
        });

        logger.push(`RESULT: ${JSON.stringify(finalResult)}`);

        fs.writeFileSync(this.logFileParsePath, logger.join(""), {
            flag: "w",
            encoding: "utf-8",
        });
    }
}
