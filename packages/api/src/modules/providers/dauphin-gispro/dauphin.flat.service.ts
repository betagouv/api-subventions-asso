import { ProviderEnum } from "../../../@enums/ProviderEnum";
import ProviderCore from "../ProviderCore";
import dauphinPort from "../../../dataProviders/db/providers/dauphin/dauphin.port";
import DauphinDtoAdapter, { InconsistentAggregationError } from "./adapters/DauphinDtoAdapter";
import ApplicationFlatProvider from "../../applicationFlat/@types/applicationFlatProvider";
import { ReadableStream } from "stream/web";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";

export class DauphinFlatService extends ProviderCore implements ApplicationFlatProvider {
    constructor() {
        super({
            name: "Dauphin",
            type: ProviderEnum.api,
            description:
                "Dauphin est un système d'information développé par MGDIS permettant aux associations de déposer des demandes de subvention dans le cadre de la politique de la ville et aux services instructeurs d'effectuer de la co-instruction.",
            id: "dauphin",
        });
    }

    /**
     * |-------------------------|
     * |   Flat Part          |
     * |-------------------------|
     */

    isApplicationFlatProvider = true as const;

    async generateTempJoinedCollection() {
        await dauphinPort.createSimplifiedDauphinBeforeJoin();
        await dauphinPort.joinGisproToSimplified();
    }

    async feedApplicationFlat() {
        await this.generateTempJoinedCollection();
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
