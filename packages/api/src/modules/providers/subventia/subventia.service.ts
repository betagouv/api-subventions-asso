import { ProviderEnum } from "../../../@enums/ProviderEnum";
import subventiaPort from "../../../dataProviders/db/providers/subventia/subventia.port";
import SubventiaParser from "./subventia.parser";
import SubventiaValidator from "./validators/subventia.validator";
import SubventiaAdapter from "./adapters/subventia.adapter";
import { SubventiaDbo } from "./@types/subventia.entity";
import SubventiaDto from "./@types/subventia.dto";
import ApplicationFlatProvider from "../../applicationFlat/@types/applicationFlatProvider";
import { ReadableStream } from "node:stream/web";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";

export class SubventiaService implements ApplicationFlatProvider {
    meta = {
        name: "Subventia",
        type: ProviderEnum.raw,
        description: "CIPDR",
        id: "subventia",
    };

    public processSubventiaData(filePath: string, exportDate: Date) {
        const parsedData = SubventiaParser.parse(filePath);
        const sortedData = SubventiaValidator.sortDataByValidity(parsedData);
        const applications = this.getApplications(sortedData["valids"], exportDate);

        return { applications, invalids: sortedData["invalids"] };
    }

    private getApplications(validData: SubventiaDto[], exportDate: Date) {
        /* to each application is associated in raw date a list of 12 lines
            corresponding to 12 items of expenditures
        */
        const grouped = this.groupByApplication(validData);
        const groupedLinesArr: SubventiaDto[][] = Object.values(grouped);
        const applications = groupedLinesArr.map(groupedLine => {
            const application = this.mergeToApplication(groupedLine);
            const entity = SubventiaAdapter.applicationToEntity(application, exportDate);
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
        return subventiaPort.create(entity);
    }

    /**
     * |---------------------------|
     * |   Application Flat Part   |
     * |---------------------------|
     */

    async initApplicationFlat() {
        const dbos = await subventiaPort.findAll();
        const stream = ReadableStream.from(dbos.map(dbo => SubventiaAdapter.toApplicationFlat(dbo)));
        return this.saveApplicationsFromStream(stream);
    }

    saveApplicationsFromStream(stream: ReadableStream<ApplicationFlatEntity>) {
        return applicationFlatService.saveFromStream(stream);
    }
}

const subventiaService = new SubventiaService();

export default subventiaService;
