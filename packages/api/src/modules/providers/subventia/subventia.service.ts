import { ApplicationDto, DemandeSubvention } from "dto";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import GrantProvider from "../../grant/@types/GrantProvider";
import { RawGrant } from "../../grant/@types/rawGrant";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import SubventiaParser from "./subventia.parser";
import SubventiaValidator from "./validators/subventia.validator";
import SubventiaAdapter from "./adapters/subventia.adapter";
import subventiaRepository from "./repositories/subventia.repository";
import { SubventiaDbo } from "./@types/subventia.entity";
import SubventiaDto from "./@types/subventia.dto";

export class SubventiaService implements DemandesSubventionsProvider, GrantProvider {
    provider = {
        name: "Subventia",
        type: ProviderEnum.raw,
        description: "CIPDR",
        id: "subventia",
    };

    public processSubventiaData(filePath: string, exportDate: Date) {
        const parsedData = SubventiaParser.parse(filePath);
        const sortedData = SubventiaValidator.sortDataByValidity(parsedData);
        const applications = this.getApplications(sortedData["valids"], exportDate);

        return applications;
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
        return subventiaRepository.create(entity);
    }

    /**
     * |-------------------------|
     * |   Demande Part          |
     * |-------------------------|
     */

    isDemandesSubventionsProvider = true;

    async getDemandeSubventionBySiret(siret: string) {
        const applications = await subventiaRepository.findBySiret(siret);
        return applications.map(dbo => SubventiaAdapter.toDemandeSubventionDto(dbo));
    }

    async getDemandeSubventionBySiren(siren: string) {
        const applications = await subventiaRepository.findBySiren(siren);
        return applications.map(dbo => SubventiaAdapter.toDemandeSubventionDto(dbo));
    }

    getDemandeSubventionByRna(): Promise<DemandeSubvention[] | null> {
        return Promise.resolve(null);
    }

    /**
     * |-------------------------|
     * |   Raw Grant Part        |
     * |-------------------------|
     */

    isGrantProvider = true;

    async getRawGrantsBySiret(siret: string): Promise<RawGrant[] | null> {
        return (await subventiaRepository.findBySiret(siret)).map(grant => ({
            provider: this.provider.id,
            type: "application",
            data: grant,
        }));
    }

    async getRawGrantsBySiren(siren: string): Promise<RawGrant[] | null> {
        return (await subventiaRepository.findBySiren(siren)).map(grant => ({
            provider: this.provider.id,
            type: "application",
            data: grant,
        }));
    }

    getRawGrantsByRna(): Promise<RawGrant[] | null> {
        return Promise.resolve(null);
    }

    rawToCommon(raw: RawGrant): ApplicationDto {
        return SubventiaAdapter.toCommon(raw.data as SubventiaDbo);
    }
}

const subventiaService = new SubventiaService();

export default subventiaService;
