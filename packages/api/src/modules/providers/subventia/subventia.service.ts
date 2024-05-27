import SubventiaParser from "./subventia.parser";
import SubventiaValidator from "./validators/subventia.validator";
import SubventiaAdapter from "./adapters/subventiaAdapter";
import SubventiaLineEntity from "./entities/SubventiaLineEntity";
import { SubventiaDbo } from "./@types/ISubventiaIndexedInformation";
import subventiaRepository from "./repositories/subventia.repository";

export class SubventiaService {
    public ProcessSubventiaData(filePath: string) {
        const parsedData = SubventiaParser.parse(filePath);
        const sortedData = SubventiaValidator.sortDataByValidity(parsedData);
        const applications = this.getApplications(sortedData["valids"]);

        return applications;
    }

    public getApplications(validData) {
        /* to each application is associated in raw date a list of 12 lines
            corresponding to 12 items of expenditures
        */
        const grouped = this.groupByApplication(validData);
        const groupedLinesArr: any[][] = Object.values(grouped);
        const applications = groupedLinesArr.map(groupedLine => {
            const application = this.mergeToApplication(groupedLine);
            const entity = SubventiaAdapter.applicationToEntity(application);
            return {
                ...entity,
                provider: "Subventia",
                /*
                provider en théorie devrait être définit lorsque
                l'on construit la classe SubventiaLineEntity mais 
                ici on le fait jamais! Preneuse de retours éventuelles pour faire la chose
                plus proprement
                */
                __data__: groupedLine,
            } as unknown as SubventiaLineEntity;
        });

        return applications;
    }

    public groupByApplication<T>(validData: T[]) {
        const groupKey = "Référence administrative - Demande";
        return validData.reduce((acc, currentLine: T) => {
            if (!acc[currentLine[groupKey]]) {
                acc[currentLine[groupKey]] = [];
            }
            acc[currentLine[groupKey]].push(currentLine);
            return acc;
        }, {});
    }

    public mergeToApplication(applicationLines: any[]) {
        const amountKey = "Montant Ttc";
        return applicationLines.slice(1).reduce(
            (mainLine: Record<string, any>, currentLine: Record<string, any>) => {
                mainLine[amountKey] = Number(mainLine[amountKey]) + Number(currentLine[amountKey]);
                return mainLine;
            },
            { ...applicationLines[0] },
        );
    }

    async createEntity(entity: SubventiaLineEntity) {
        return subventiaRepository.create(entity);
    }
}

const subventiaService = new SubventiaService();

export default subventiaService;
