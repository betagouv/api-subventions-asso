import { isAssociationName, areNumbersValid, isSiret, areStringsValid } from "../../../shared/Validators";
import SubventiaLineEntity from "./entities/SubventiaLineEntity";
import SubventiaRepository from "./repositories/subventia.repository";
import { SubventiaDbo } from "./@types/ISubventiaIndexedInformation";
/*
export enum SUBVENTIA_SERVICE_ERROR {
    INVALID_ENTITY = 1,
}
*/
/*
export interface RejectedRequest {
    state: "rejected";
    result: { message: string; data: unknown };
}

export interface AcceptedRequest {
    state: "created";
}
*/

export class SubventiaService {
    static getApplications(validData) {
        /* to each application is associated in raw date a list of 12 lines
            corresponding to 12 items of expenditures
        */
        const grouped = this.groupByApplication(validData);
        const groupedLinesArr: any[][] = Object.values(grouped);
        const applications = groupedLinesArr.map(groupedLine => {
            const application = this.mergeToApplication(groupedLine);
            const entity = this.applicationToEntity(application);
            return {
                ...entity,
                __data__: groupedLine,
            };
        });

        return applications;
    }

    protected static groupByApplication<T>(validData: T[]) {
        const groupKey = "Référence administrative - Demande";
        return validData.reduce((acc, currentLine: T) => {
            if (!acc[currentLine[groupKey]]) {
                acc[currentLine[groupKey]] = [];
            }
            acc[currentLine[groupKey]].push(currentLine);
            return acc;
        }, {});
    }

    protected static mergeToApplication(applicationLines: any[]) {
        const amountKey = "Montant Ttc";
        return applicationLines.reduce((mainLine: Record<string, any>, currentLine: Record<string, any>) => {
            mainLine[amountKey] = Number(mainLine[amountKey]) + Number(currentLine[amountKey]);
            return mainLine;
        });
    }

    async createEntity(entity: SubventiaLineEntity) {
        return SubventiaRepository.create(entity);
    }
}

const subventiaService = new SubventiaService();

export default subventiaService;
