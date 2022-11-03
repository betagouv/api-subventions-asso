import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../../@types/Cli.interface";
import DataGouvParser from "../../datagouv.parser";
import dataGouvService from "../../datagouv.service";
import { IStreamAction } from "../../@types";
import CliController from '../../../../../shared/CliController';
import { UniteLegalHistoryRaw } from "../../@types/UniteLegalHistoryRaw";
import { isValidDate } from "../../../../../shared/helpers/DateHelper";

@StaticImplements<CliStaticInterface>()
export default class DataGouvCliController extends CliController {
    static cmdName = "datagouv";

    protected logFileParsePath = "./logs/datagouv.parse.log.txt"

    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        this.logger.logIC(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        if(!isValidDate(exportDate)) {
            throw new Error("exportDate is required");
        }

        const lastImportDate = await dataGouvService.getLastDateImport();

        function isAssociation(entity: UniteLegalHistoryRaw) {
            // ... Implement check if entity is an association
            return false;
        }

        function saveAssociations(entities: UniteLegalHistoryRaw[]) {
            // Here transform UniteLegalHistoryRaw on the right format (AssociationName for exemple)
            // and insert associations information on repository
        }

        function saveEntreprises(entities: UniteLegalHistoryRaw[]) {
            // Here transform UniteLegalHistoryRaw on the right format (EntrepriseSirenEntity for exemple)
            // and insert entreprises information on repository (InsertMany)
            
            // await dataGouvService.insertManyEntrepriseSiren(entreprises);
        }

        let chunksInSave = 0;
        const stackEntreprise: UniteLegalHistoryRaw[] = [];
        const stackAssociation: UniteLegalHistoryRaw[] = [];

        const saveEntity = async (entity: UniteLegalHistoryRaw, streamPause: IStreamAction, streamResume: IStreamAction) => {
            if (isAssociation(entity)) {
                // Add association rules
                // IsNew && ChangeName ...
                // ...
                stackAssociation.push(entity);
            } else {
                // Add entreprise rules
                // ...
                stackEntreprise.push(entity);
            }

            if (stackEntreprise.length < 1000 && stackAssociation.length < 1000) return;
            
            streamPause();
            chunksInSave++;

            if (stackEntreprise.length > 1000)  {
                await saveEntreprises(stackEntreprise.splice(-1000));
            }

            if (stackAssociation.length > 1000) {
                await saveAssociations(stackAssociation.splice(-1000));
            }

            chunksInSave--;
            if (chunksInSave === 0) {
                streamResume();
            }
        };


        await DataGouvParser.parseUniteLegalHistory(file, lastImportDate, saveEntity);

        if (stackEntreprise.length) {
            await saveEntreprises(stackEntreprise);
        }

        if (stackAssociation.length) {
            await saveAssociations(stackAssociation);
        }

        await dataGouvService.addNewImport({
            filename: file,
            dateOfFile: exportDate,
            dateOfImport: new Date()
        })
    }
}