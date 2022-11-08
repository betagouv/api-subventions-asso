import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types/Cli.interface";
import DataGouvParser, { SaveCallback } from "../../datagouv.parser";
import dataGouvService from "../../datagouv.service";
import CliController from '../../../../../shared/CliController';
import { UniteLegalHistoryRaw } from "../../@types/UniteLegalHistoryRaw";
import { isValidDate } from "../../../../../shared/helpers/DateHelper";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../../shared/LegalCategoriesAccepted";
import AssociationNameEntity from "../../../../association-name/entities/AssociationNameEntity";
import associationNameService from "../../../../association-name/associationName.service";
import EntrepriseSirenEntity from "../../entities/EntrepriseSirenEntity";

@StaticImplements<CliStaticInterface>()
export default class DataGouvCliController extends CliController {
    static cmdName = "datagouv";

    protected logFileParsePath = "./logs/datagouv.parse.log.txt"

    private isAssociation(entity: UniteLegalHistoryRaw) {
        if (LEGAL_CATEGORIES_ACCEPTED.includes(String(entity.categorieJuridiqueUniteLegale))) return true;
        return false;
    }

    private shouldAssoBeSaved(entity: UniteLegalHistoryRaw) {
        return (entity.changementDenominationUniteLegale === "true" || this.isUniteLegaleNew(entity));
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
            "changementCaractereEmployeurUniteLegale"
        ];

        return !props.find(prop => entity[prop] === "true");
    }

    private rawToAssociationName(raw: UniteLegalHistoryRaw) {
        return new AssociationNameEntity(null, raw.denominationUniteLegale, dataGouvService.provider.name, new Date(raw.dateDebut), raw.siren)
    }

    private rawToEntrepriseSiren(raw: UniteLegalHistoryRaw) {
        return new EntrepriseSirenEntity(raw.siren);
    }

    private saveAssociations(raws: UniteLegalHistoryRaw[]) {
        return Promise.all(
            raws
                .map(this.rawToAssociationName)
                .map(associationName => associationNameService.upsert(associationName))
        )
    }

    private saveEntreprises(raws: UniteLegalHistoryRaw[]) {
        return Promise.all(
            raws
                .map(this.rawToEntrepriseSiren)
                .map(entrepriseSiren => dataGouvService.addEntrepriseSiren(entrepriseSiren))
        )
    }

    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        this.logger.logIC(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        if (!isValidDate(exportDate)) {
            throw new Error("exportDate is required");
        }

        const lastImportDate = await dataGouvService.getLastDateImport();

        let chunksInSave = 0;
        const stackEntreprise: UniteLegalHistoryRaw[] = [];
        const stackAssociation: UniteLegalHistoryRaw[] = [];

        const saveEntity: SaveCallback = async (entity, streamPause, streamResume) => {
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
            dateOfImport: new Date()
        })
    }
}