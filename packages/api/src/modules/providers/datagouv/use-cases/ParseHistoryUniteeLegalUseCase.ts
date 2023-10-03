import CliLogger from "../../../../shared/CliLogger";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../shared/LegalCategoriesAccepted";
import { asyncForEach } from "../../../../shared/helpers/ArrayHelper";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import associationNameService from "../../../association-name/associationName.service";
import { SaveCallback } from "../@types";
import { UniteLegalHistoryRow } from "../@types/UniteLegalHistoryRow";
import { UniteLegaleHistoriqueAdapter } from "../adapter/UniteLegaleHistoriqueAdapter";
import DataGouvHistoryLegalUnitParser from "../dataGouvHistoryLegalUnitParser";
import dataGouvService from "../datagouv.service";

export default async function ParseHistoryUniteeLegalUseCase(file: string, date: Date, logger?: CliLogger) {
    if (logger) logger.logIC(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

    if (!isValidDate(date)) {
        throw new Error("date is required");
    }

    const lastImportDate = await dataGouvService.getLastDateImport();

    let chunksInSave = 0;
    const chunksSize = 1000;
    const stackEntreprise: UniteLegalHistoryRow[] = [];
    const stackAssociation: UniteLegalHistoryRow[] = [];

    const saveEntity: SaveCallback<UniteLegalHistoryRow> = async (entity, streamPause, streamResume) => {
        if (isAssociation(entity) && shouldAssoBeSaved(entity)) {
            stackAssociation.push(entity);
        } else if (isUniteLegaleNew(entity)) {
            stackEntreprise.push(entity);
        }

        if (stackEntreprise.length < chunksSize && stackAssociation.length < chunksSize) return;

        streamPause();
        chunksInSave++;

        if (stackEntreprise.length > chunksSize) {
            await saveEntreprises(stackEntreprise.splice(-chunksSize));
        }

        if (stackAssociation.length > chunksSize) {
            await saveAssociations(stackAssociation.splice(-chunksSize));
        }

        chunksInSave--;
        if (chunksInSave === 0) {
            streamResume();
        }
    };

    await DataGouvHistoryLegalUnitParser.parseUniteLegalHistory(file, saveEntity, lastImportDate);
    if (stackEntreprise.length) {
        await saveEntreprises(stackEntreprise);
    }

    if (stackAssociation.length) {
        await saveAssociations(stackAssociation);
    }

    await dataGouvService.addNewImport({
        filename: file,
        dateOfFile: date,
        dateOfImport: new Date(),
    });
}

function isAssociation(entity: UniteLegalHistoryRow) {
    return LEGAL_CATEGORIES_ACCEPTED.includes(String(entity.categorieJuridiqueUniteLegale));
}

function shouldAssoBeSaved(entity: UniteLegalHistoryRow) {
    return entity.changementDenominationUniteLegale === "true" || isUniteLegaleNew(entity);
}

function isUniteLegaleNew(entity) {
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

function saveAssociations(rows: UniteLegalHistoryRow[]) {
    return asyncForEach(rows, async row => {
        const entity = UniteLegaleHistoriqueAdapter.rowToAssociationName(row);
        await associationNameService.upsert(entity);
    });
}

function saveEntreprises(rows: UniteLegalHistoryRow[]) {
    return dataGouvService.insertManyEntrepriseSiren(rows.map(UniteLegaleHistoriqueAdapter.rowToEntrepriseSiren));
}
