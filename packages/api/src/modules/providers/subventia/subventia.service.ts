import { CommonApplicationDto, DemandeSubvention } from "dto";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import GrantProvider from "../../grant/@types/GrantProvider";
import { RawApplication, RawGrant } from "../../grant/@types/rawGrant";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";
import { StructureIdentifier } from "../../../@types";
import EstablishmentIdentifier from "../../../valueObjects/EstablishmentIdentifier";
import subventiaRepository from "../../../dataProviders/db/providers/subventia/subventia.port";
import SubventiaParser from "./subventia.parser";
import SubventiaValidator from "./validators/subventia.validator";
import SubventiaAdapter from "./adapters/subventia.adapter";
import SubventiaEntity, { SubventiaDbo } from "./@types/subventia.entity";
import SubventiaDto from "./@types/subventia.dto";

export class SubventiaService implements DemandesSubventionsProvider<SubventiaEntity>, GrantProvider {
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
        return subventiaRepository.create(entity);
    }

    /**
     * |-------------------------|
     * |   Demande Part          |
     * |-------------------------|
     */

    isDemandesSubventionsProvider = true;

    async getDemandeSubvention(id: StructureIdentifier): Promise<DemandeSubvention[]> {
        const applications: SubventiaDbo[] = [];

        if (id instanceof EstablishmentIdentifier && id.siret) {
            applications.push(...(await subventiaRepository.findBySiret(id.siret)));
        } else if (id instanceof AssociationIdentifier && id.siren) {
            applications.push(...(await subventiaRepository.findBySiren(id.siren)));
        }

        return applications.map(dbo => SubventiaAdapter.toDemandeSubventionDto(dbo));
    }

    /**
     * |-------------------------|
     * |   Raw Grant Part        |
     * |-------------------------|
     */

    isGrantProvider = true;

    async getRawGrants(id: StructureIdentifier): Promise<RawGrant[]> {
        let subventiaDbos: SubventiaDbo[] = [];
        if (id instanceof EstablishmentIdentifier && id.siret) {
            subventiaDbos = await subventiaRepository.findBySiret(id.siret);
        } else if (id instanceof AssociationIdentifier && id.siren) {
            subventiaDbos = await subventiaRepository.findBySiren(id.siren);
        }

        return subventiaDbos.map(grant => ({
            provider: this.provider.id,
            type: "application",
            data: grant,
        }));
    }

    rawToCommon(raw: RawGrant): CommonApplicationDto {
        return SubventiaAdapter.toCommon(raw.data as SubventiaDbo);
    }

    rawToApplication(rawApplication: RawApplication<SubventiaEntity>) {
        return SubventiaAdapter.rawToApplication(rawApplication);
    }
}

const subventiaService = new SubventiaService();

export default subventiaService;
