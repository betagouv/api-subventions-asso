import xlsx from 'node-xlsx';

import OsirisFileEntity from "./entities/OsirisFileEntity";
import OsirisActionsNumberColumn, { OsirisActionsNumberColumnKeys } from "./@types/file/OsirisActionsNumberColumn";
import OsirisAmountsColumn, { OsirisAmountsColumnKeys } from "./@types/file/OsirisAmountsColumn";
import OsirisAssociationColumn, { OsirisAssociationColumnKeys } from "./@types/file/OsirisAssociationColumn";
import OsirisCommentsColumn, { OsirisCommentsColumnKeys } from "./@types/file/OsirisCommentsColumn";
import OsirisEvaluationColumn, { OsirisEvaluationColumnKeys } from "./@types/file/OsirisEvaluationColumn";
import OsirisFileColumn, { OsirisFileColumnKeys } from "./@types/file/OsirisFileColumn";
import OsirisLegalRepresentativeColumn, { OsirisLegalRepresentativeColumnKeys } from "./@types/file/OsirisLegalRepresentativeColumn";
import OsirisMailingAddressColumn, { OsirisMailingAddressColumnKeys } from "./@types/file/OsirisMailingAddressColumn";
import OsirisPaymentsColumn, { OsirisPaymentsColumnKeys } from "./@types/file/OsirisPaymentsColumn";

import OsirisActionEntity from './entities/OsirisActionEntity';
import OsirisActionFileColumn, { OsirisActionFileColumnKeys } from './@types/action/OsirisActionFileColumn';
import OsirisActionBeneficiariesColumn, { OsirisActionBeneficiariesColumnKeys } from './@types/action/OsirisActionBeneficiariesColumn';
import OsirisActionSpecificationsColumn, { OsirisActionSpecificationsColumnKeys } from './@types/action/OsirisActionSpecificationsColumn';
import OsirisActionAffiliatingFederationColumn, { OsirisActionAffiliatingFederationColumnKeys } from './@types/action/OsirisActionAffiliatingFederationColumn';
import OsirisActionAmountsColumn, { OsirisActionAmountsColumnKeys } from './@types/action/OsirisActionAmountsColumn';
import OsirisActionEvaluationColumn, { OsirisActionEvaluationColumnKeys } from './@types/action/OsirisActionEvaluationColumn';
import OsirisActionResourcesColumn, { OsirisActionResourcesColumnKeys } from './@types/action/OsirisActionResourcesColumn';
import OsirisActionTerritoriesColumn, { OsirisActionTerritoriesColumnKeys } from './@types/action/OsirisActionTerritoriesColumn';
import OsirisActionCoFinanciersColumn, { OsirisActionCoFinanciersColumnKeys } from './@types/action/OsirisActionCoFinanciersColumn';
import OsirisActionCustomColumn, { OsirisActionCustomColumnKeys } from './@types/action/OsirisActionCustomColumn';
import OsirisActionOtherColumn, { OsirisActionOtherColumnKeys } from './@types/action/OsirisActionOtherColumn';
import OsirisActionResourcesEvaluationColumn, { OsirisActionResourcesEvaluationColumnKeys } from './@types/action/OsirisActionResourcesEvaluationColumn';
import OsirisActionBeneficiaryAssociationColumn, { OsirisActionBeneficiaryAssociationColumnKeys } from './@types/action/OsirisActionBeneficiaryAssociationColumn';

export default class OsirisParser {
    public static parseFiles(content: Buffer): OsirisFileEntity[] {
        const xls = xlsx.parse(content);
        const data = xls[0].data.filter((row) => (row as unknown[]).length);
        const raws = data.slice(2, data.length - 1) as unknown[]; // Delete Headers and footers

        return raws.map((raw) => {
            const fileColumn = this.createObjectByColumnDef<OsirisFileColumn>((raw as unknown[]), OsirisFileColumnKeys);
            const associationColumn = this.createObjectByColumnDef<OsirisAssociationColumn>((raw as unknown[]), OsirisAssociationColumnKeys);
            const mailingAddressColumn = this.createObjectByColumnDef<OsirisMailingAddressColumn>((raw as unknown[]), OsirisMailingAddressColumnKeys);
            const legalRepresentativeColumn = this.createObjectByColumnDef<OsirisLegalRepresentativeColumn>((raw as unknown[]), OsirisLegalRepresentativeColumnKeys);
            const actionsNumberColumn = this.createObjectByColumnDef<OsirisActionsNumberColumn>((raw as unknown[]), OsirisActionsNumberColumnKeys);
            const amountColumn = this.createObjectByColumnDef<OsirisAmountsColumn>((raw as unknown[]), OsirisAmountsColumnKeys);
            const paymentsColumn = this.createObjectByColumnDef<OsirisPaymentsColumn>((raw as unknown[]), OsirisPaymentsColumnKeys);
            const evaluationColumn = this.createObjectByColumnDef<OsirisEvaluationColumn>((raw as unknown[]), OsirisEvaluationColumnKeys);
            const commentsColumn = this.createObjectByColumnDef<OsirisCommentsColumn>((raw as unknown[]), OsirisCommentsColumnKeys);

            return new OsirisFileEntity(
                fileColumn,
                associationColumn,
                mailingAddressColumn,
                legalRepresentativeColumn,
                actionsNumberColumn,
                amountColumn,
                paymentsColumn,
                evaluationColumn,
                commentsColumn
            );
        });
    }

    public static parseActions(content: Buffer) {
        const xls = xlsx.parse(content);

        const data = xls[0].data.filter((row) => (row as unknown[]).length);
        const raws = data.slice(2, data.length - 1) as unknown[]; // Delete Headers and footers

        return raws.map((raw) => {
            const fileColumn = this.createObjectByColumnDef<OsirisActionFileColumn>((raw as unknown[]), OsirisActionFileColumnKeys);
            const beneficiariesColumn = this.createObjectByColumnDef<OsirisActionBeneficiaryAssociationColumn>((raw as unknown[]), OsirisActionBeneficiaryAssociationColumnKeys);
            const specifications = this.createObjectByColumnDef<OsirisActionSpecificationsColumn>((raw as unknown[]), OsirisActionSpecificationsColumnKeys);
            const affiliatingFederation = this.createObjectByColumnDef<OsirisActionAffiliatingFederationColumn>((raw as unknown[]), OsirisActionAffiliatingFederationColumnKeys);
            const beneficiaries = this.createObjectByColumnDef<OsirisActionBeneficiariesColumn>((raw as unknown[]), OsirisActionBeneficiariesColumnKeys);
            const territories = this.createObjectByColumnDef<OsirisActionTerritoriesColumn>((raw as unknown[]), OsirisActionTerritoriesColumnKeys);
            const resources = this.createObjectByColumnDef<OsirisActionResourcesColumn>((raw as unknown[]), OsirisActionResourcesColumnKeys);
            const resourcesEvaluation = this.createObjectByColumnDef<OsirisActionResourcesEvaluationColumn>((raw as unknown[]), OsirisActionResourcesEvaluationColumnKeys);
            const amount = this.createObjectByColumnDef<OsirisActionAmountsColumn>((raw as unknown[]), OsirisActionAmountsColumnKeys);
            const coFinanciers = this.createObjectByColumnDef<OsirisActionCoFinanciersColumn>((raw as unknown[]), OsirisActionCoFinanciersColumnKeys);
            const other = this.createObjectByColumnDef<OsirisActionOtherColumn>((raw as unknown[]), OsirisActionOtherColumnKeys);
            const evaluation = this.createObjectByColumnDef<OsirisActionEvaluationColumn>((raw as unknown[]), OsirisActionEvaluationColumnKeys);
            const custom = this.createObjectByColumnDef<OsirisActionCustomColumn>((raw as unknown[]), OsirisActionCustomColumnKeys);

            return new OsirisActionEntity(
                fileColumn,
                beneficiariesColumn,
                specifications,
                affiliatingFederation,
                beneficiaries,
                territories,
                resources,
                resourcesEvaluation,
                amount,
                coFinanciers,
                other,
                evaluation,
                custom,
            );
        });
    }

    private static createObjectByColumnDef<T>(raw: unknown[], columnKeys: { [key: string] : number}): T {
        return Object.entries(columnKeys).reduce((acc, [key, value]) => {
            acc[key] = raw[value];
            return acc;
        }, {} as { [key: string] : unknown })as unknown as T;
    }
}