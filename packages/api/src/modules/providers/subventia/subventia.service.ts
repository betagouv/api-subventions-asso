import Provider from "../@types/IProvider";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import SubventiaParser from "./subventia.parser";
import SubventiaValidator from "./validators/subventia.validator";
import SubventiaAdapter from "./adapters/subventia.adapter";
import subventiaRepository from "./repositories/subventia.repository";
import { SubventiaDbo } from "./@types/subventia.entity";
import SubventiaDto from "./@types/subventia.dto";

export class SubventiaService implements Provider {
    provider = {
        name: "Subventia",
        type: ProviderEnum.raw,
        description: "CIPDR",
        id: "subventia",
    };

    public processSubventiaData(filePath: string) {
        const parsedData = SubventiaParser.parse(filePath);
        const sortedData = SubventiaValidator.sortDataByValidity(parsedData);
        const applications = this.getApplications(sortedData["valids"]);

        return applications;
    }

    private getApplications(validData) {
        /* to each application is associated in raw date a list of 12 lines
            corresponding to 12 items of expenditures
        */
        const grouped = this.groupByApplication(validData);
        const groupedLinesArr: SubventiaDto[][] = Object.values(grouped);
        const applications = groupedLinesArr.map(groupedLine => {
            const application = this.mergeToApplication(groupedLine);
            const entity = SubventiaAdapter.applicationToEntity(application);
            return {
                ...entity,
                __data__: groupedLine,
            } as Omit<SubventiaDbo, "_id">;
        });

        return applications;
    }

    private groupByApplication(validData: SubventiaDto[]) {
        const groupKey = "Référence administrative - Demande";
        return validData.reduce((acc, currentLine: SubventiaDto) => {
            if (!acc[currentLine[groupKey]]) {
                acc[currentLine[groupKey]] = [];
            }
            acc[currentLine[groupKey]].push(currentLine);
            return acc;
        }, {});
    }

    private mergeToApplication(applicationLines: SubventiaDto[]) {
        const amountKey = "Montant Ttc";
        return applicationLines.slice(1).reduce(
            (mainLine, currentLine) => {
                mainLine[amountKey] = Number(mainLine[amountKey]) + Number(currentLine[amountKey]);
                return mainLine;
            },
            { ...applicationLines[0] },
        );
    }

    async createEntity(entity: Omit<SubventiaDbo, "_id">) {
        return subventiaRepository.create(entity);
    }
}

const subventiaService = new SubventiaService();

export default subventiaService;
