import dauphinPort from "../../../dataProviders/db/providers/dauphin/dauphin.port";
import DauphinDtoAdapter, { InconsistentAggregationError } from "./adapters/DauphinDtoAdapter";
import ApplicationFlatProvider from "../../applicationFlat/@types/applicationFlatProvider";
import { ReadableStream } from "stream/web";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";

export class DauphinFlatService implements ApplicationFlatProvider {
    /**
     * |-------------------------|
     * |   Flat Part          |
     * |-------------------------|
     */

    async generateTempJoinedCollection() {
        await dauphinPort.createSimplifiedDauphinBeforeJoin();
        await dauphinPort.joinGisproToSimplified();
    }

    async feedApplicationFlat() {
        console.log("Generating simplified and joined collections...");
        await this.generateTempJoinedCollection();
        console.log("Start transforming data into application...");
        const cursor = dauphinPort.findAllTempCursor();
        const errors: InconsistentAggregationError[] = [];
        const stream = cursorToStream(cursor, simplified => {
            try {
                return DauphinDtoAdapter.simplifiedJoinedToApplicationFlat(simplified);
            } catch (e) {
                if (e instanceof InconsistentAggregationError) {
                    errors.push(e);
                    return null;
                }
                throw e;
            }
        });
        console.log("Initializing applicationFlat feed...");
        await this.saveFlatFromStream(stream);

        if (errors.length)
            console.log(
                "Les enregistrements suivants n'ont pas été sauvegardés car l'aggrégation était incohérente : ",
                errors.map(
                    e =>
                        `dossier n°${e.codeDossier} et refAdmin n°${e.referenceAdministrative} ont pour le champ ${e.field} les valeurs ${e.valueList}`,
                    "\nEn conséquence la collection temporaire n'a pas été vidée.",
                ),
            );
        else await dauphinPort.cleanTempCollection();
    }

    async saveFlatFromStream(stream: ReadableStream<ApplicationFlatEntity>): Promise<void> {
        await applicationFlatService.saveFromStream(stream);
    }
}

const dauphinFlatService = new DauphinFlatService();

export default dauphinFlatService;
