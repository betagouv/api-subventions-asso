import { printAtSameLine } from "../../../shared/helpers/CliHelper";
import { osirisRequestPort, osirisActionPort, osirisEvaluationPort } from "../../../dataProviders/db/providers/osiris";

export default class OsirisMigration {
    async setExtractYearOnOsirisEntities(year = 2021) {
        console.log("Set in requets");
        const requestsCursor = osirisRequestPort.cursorFindRequests({});

        let counter = 0;
        while (await requestsCursor.hasNext()) {
            const doc = await requestsCursor.next();
            if (!doc) continue;
            doc.providerInformations.extractYear = year;
            await osirisRequestPort.update(doc);
            counter++;
            printAtSameLine(counter.toString());
        }

        console.log("Set in actions");
        const actionsCursor = osirisActionPort.cursorFind({});

        counter = 0;
        while (await actionsCursor.hasNext()) {
            const doc = await actionsCursor.next();
            if (!doc) continue;
            doc.indexedInformations.extractYear = year;
            await osirisActionPort.update(doc);
            counter++;
            printAtSameLine(counter.toString());
        }

        console.log("Set in evaluations");
        const evaluationsCursor = osirisEvaluationPort.cursorFind({});

        counter = 0;
        while (await evaluationsCursor.hasNext()) {
            const doc = await evaluationsCursor.next();
            if (!doc) continue;
            doc.indexedInformations.extractYear = year;
            await osirisEvaluationPort.update(doc);
            counter++;
            printAtSameLine(counter.toString());
        }

        console.log("Migration ended");
    }
}
