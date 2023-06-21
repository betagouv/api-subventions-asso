import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import DataGouvParser from "../../datagouv.parser";
import dataGouvService from "../../datagouv.service";
import CliController from "../../../../../shared/CliController";
import { UniteLegalHistoryRow } from "../../@types/UniteLegalHistoryRow";
import { isValidDate } from "../../../../../shared/helpers/DateHelper";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../../shared/LegalCategoriesAccepted";
import associationNameService from "../../../../association-name/associationName.service";
import { UniteLegaleHistoriqueAdapter } from "../../adapter/UniteLegaleHistoriqueAdapter";
import { asyncForEach } from "../../../../../shared/helpers/ArrayHelper";
import { SaveCallback } from "../../@types";

@StaticImplements<CliStaticInterface>()
export default class DataGouvCliController extends CliController {
    static cmdName = "datagouv";

    protected logFileParsePath = "./logs/datagouv.parse.log.txt";

    private isAssociation(entity: UniteLegalHistoryRow) {
        return LEGAL_CATEGORIES_ACCEPTED.includes(String(entity.categorieJuridiqueUniteLegale));
    }

    private shouldAssoBeSaved(entity: UniteLegalHistoryRow) {
        return entity.changementDenominationUniteLegale === "true" || this.isUniteLegaleNew(entity);
    }

    private isUniteLegaleNew(entity) {
        const props = [
            "changementEtatAdministratifUniteLegale",
            "changementNomUniteLegale",
            "changementNomUsageUniteLegale",
            "changementDenominationUniteLegale",
            "changementDenominationUsuelleUniteLegale",
            "changementCategorieJuridiqueUniteLegale",
            "changementActivitePrincipaleUniteLegale",
            "changementNicSiegeUniteLegale",
            "changementEconomieSocialeSolidaireUniteLegale",
            "changementSocieteMissionUniteLegale",
            "changementCaractereEmployeurUniteLegale",
        ];

        return props.every(prop => entity[prop] === "false");
    }

    private saveAssociations(rows: UniteLegalHistoryRow[]) {
        return asyncForEach(rows, async row => {
            const entity = UniteLegaleHistoriqueAdapter.rowToAssociationName(row);
            await associationNameService.upsert(entity);
        });
    }

    private saveEntreprises(rows: UniteLegalHistoryRow[]) {
        return dataGouvService.insertManyEntrepriseSiren(rows.map(UniteLegaleHistoriqueAdapter.rowToEntrepriseSiren));
    }

    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        this.logger.logIC(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        if (!isValidDate(exportDate)) {
            throw new Error("exportDate is required");
        }

        const lastImportDate = await dataGouvService.getLastDateImport();

        let chunksInSave = 0;
        const stackEntreprise: UniteLegalHistoryRow[] = [];
        const stackAssociation: UniteLegalHistoryRow[] = [];

        const saveEntity: SaveCallback<UniteLegalHistoryRow> = async (entity, streamPause, streamResume) => {
            if (this.isAssociation(entity)) {
                if (this.shouldAssoBeSaved(entity)) {
                    stackAssociation.push(entity);
                }
            } else {
                if (this.isUniteLegaleNew(entity)) {
                    stackEntreprise.push(entity);
                }
            }

            if (stackEntreprise.length < 1000 && stackAssociation.length < 1000) return;

            streamPause();
            chunksInSave++;

            if (stackEntreprise.length > 1000) {
                await this.saveEntreprises(stackEntreprise.splice(-1000));
            }

            if (stackAssociation.length > 1000) {
                await this.saveAssociations(stackAssociation.splice(-1000));
            }

            chunksInSave--;
            if (chunksInSave === 0) {
                streamResume();
            }
        };

        await DataGouvParser.parseUniteLegalHistory(file, saveEntity, lastImportDate);
        if (stackEntreprise.length) {
            await this.saveEntreprises(stackEntreprise);
        }

        if (stackAssociation.length) {
            await this.saveAssociations(stackAssociation);
        }

        await dataGouvService.addNewImport({
            filename: file,
            dateOfFile: exportDate,
            dateOfImport: new Date(),
        });
    }
}
