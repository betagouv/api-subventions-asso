import CliLogger from "../../../../shared/CliLogger";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../shared/LegalCategoriesAccepted";
import uniteLegalNameService from "../../uniteLegalName/uniteLegal.name.service";
import uniteLegalEntrepriseService from "../../uniteLegalEntreprises/uniteLegal.entreprises.service";
import HistoryUniteLegalImportEntity from "../../../../entities/HistoryUniteLegalImportEntity";
import DataGouvHistoryLegalUnitParser from "./parser/dataGouvHistoryLegalUnitParser";
import { UniteLegaleHistoriqueAdapter } from "./adapters/UniteLegaleHistoriqueAdapter";
import filesDatagouvService from "./uniteLegal.files.service";
import uniteLegalImportService from "./uniteLegal.import.service";
import { SaveCallback, UniteLegalHistoryRow } from "./@types";

export class UniteLegalParseService {
    async updateHistoryUniteLegal() {
        const archivePath = await filesDatagouvService.downloadHistoryUniteLegal();
        const filePath = await filesDatagouvService.decompressHistoryUniteLegal(archivePath);
        await this.parse(filePath, new Date());
    }
    async parse(file: string, date: Date, logger?: CliLogger) {
        if (logger) logger.logIC(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        if (!isValidDate(date)) {
            throw new Error("date is required");
        }

        const lastImportDate = await uniteLegalImportService.getLastDateImport();

        const chunksMetadata = {
            chunksInSave: 0,
            chunksSize: 1000,
        };
        const stackEntreprise: UniteLegalHistoryRow[] = [];
        const stackAssociation: UniteLegalHistoryRow[] = [];
        const saveEntityMethod = this._saveEntityFactory(stackAssociation, stackEntreprise, chunksMetadata);

        await DataGouvHistoryLegalUnitParser.parseUniteLegalHistory(file, saveEntityMethod, lastImportDate);
        if (stackEntreprise.length) {
            await this._saveEntreprises(stackEntreprise);
        }

        if (stackAssociation.length) {
            await this._saveAssociations(stackAssociation);
        }

        await uniteLegalImportService.addNewImport(new HistoryUniteLegalImportEntity(file, date, new Date()));
    }

    /**
     * Please dont use this method, its private method, but its exposed for testing.
     *
     * @private
     */
    private _isAssociation(entity: UniteLegalHistoryRow) {
        return LEGAL_CATEGORIES_ACCEPTED.includes(String(entity.categorieJuridiqueUniteLegale));
    }

    /**
     * Please dont use this method, its private method, but its exposed for testing.
     *
     * @private
     */
    private _shouldBeSaved(entity: UniteLegalHistoryRow) {
        return entity.changementDenominationUniteLegale === "true" || this._isUniteLegaleNew(entity);
    }

    /**
     * Please dont use this method, its private method, but its exposed for testing.
     *
     * @private
     */
    private _isUniteLegaleNew(entity) {
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

    /**
     * Please dont use this method, its private method, but its exposed for testing.
     *
     * @private
     */
    private async _saveAssociations(rows: UniteLegalHistoryRow[]) {
        for (const row of rows) {
            const entity = UniteLegaleHistoriqueAdapter.rowToUniteLegalNameEntity(row);
            await uniteLegalNameService.upsert(entity);
        }
    }

    /**
     * Please dont use this method, its private method, but its exposed for testing.
     *
     * @private
     */
    private _saveEntreprises(rows: UniteLegalHistoryRow[]) {
        return uniteLegalEntrepriseService.insertManyEntrepriseSiren(
            rows.map(UniteLegaleHistoriqueAdapter.rowToUniteLegalEntrepriseEntity),
        );
    }

    /**
     * Please dont use this method, its private method, but its exposed for testing.
     *
     * @private
     */
    private _saveEntityFactory(
        stackAssociation: UniteLegalHistoryRow[],
        stackEntreprise: UniteLegalHistoryRow[],
        chunksMetadata: { chunksSize: number; chunksInSave: number },
    ): SaveCallback<UniteLegalHistoryRow> {
        return async (entity, streamPause, streamResume) => {
            if (this._isAssociation(entity) && this._shouldBeSaved(entity)) {
                stackAssociation.push(entity);
            } else if (this._isUniteLegaleNew(entity)) {
                stackEntreprise.push(entity);
            }
            if (
                stackEntreprise.length < chunksMetadata.chunksSize &&
                stackAssociation.length < chunksMetadata.chunksSize
            )
                return;

            streamPause();
            chunksMetadata.chunksInSave++;
            if (stackEntreprise.length >= chunksMetadata.chunksSize) {
                await this._saveEntreprises(stackEntreprise.splice(-chunksMetadata.chunksSize));
            }

            if (stackAssociation.length >= chunksMetadata.chunksSize) {
                await this._saveAssociations(stackAssociation.splice(-chunksMetadata.chunksSize));
            }

            chunksMetadata.chunksInSave--;
            if (chunksMetadata.chunksInSave === 0) {
                streamResume();
            }
        };
    }
}

const uniteLegalParseService = new UniteLegalParseService();

export default uniteLegalParseService;
