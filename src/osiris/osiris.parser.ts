import xlsx from 'node-xlsx';

import OsirisFolderEntity from "./entities/OsirisFoldersEntity";

import OsirisActionsNumberColumn, { OsirisActionsNumberColumnKeys } from "./@types/OsirisActionsNumberColumn";
import OsirisAmountsColumn, { OsirisAmountsColumnKeys } from "./@types/OsirisAmountsColumn";
import OsirisAssociationColumn, { OsirisAssociationColumnKeys } from "./@types/OsirisAssociationColumn";
import OsirisCommentsColumn, { OsirisCommentsColumnKeys } from "./@types/OsirisCommentsColumn";
import OsirisEvaluationColumn, { OsirisEvaluationColumnKeys } from "./@types/OsirisEvaluationColumn";
import OsirisFolderColumn, { OsirisFolderColumnKeys } from "./@types/OsirisFolderColumn";
import OsirisLegalRepresentativeColumn, { OsirisLegalRepresentativeColumnKeys } from "./@types/OsirisLegalRepresentativeColumn";
import OsirisMailingAddressColumn, { OsirisMailingAddressColumnKeys } from "./@types/OsirisMailingAddressColumn";
import OsirisPaymentsColumn, { OsirisPaymentsColumnKeys } from "./@types/OsirisPaymentsColumn";

export default class OsirisParser {
    public static parseFolders(content: Buffer): OsirisFolderEntity[] {
        const xls = xlsx.parse(content);
        const data = xls[0].data.filter((row) => (row as unknown[]).length);
        const raws = data.slice(2, data.length - 1) as unknown[]; // Delete Headers and footers

        return raws.map((raw) => {
            const folderColumn = this.createObjectByColumnDef<OsirisFolderColumn>((raw as unknown[]), OsirisFolderColumnKeys);
            const associationColumn = this.createObjectByColumnDef<OsirisAssociationColumn>((raw as unknown[]), OsirisAssociationColumnKeys);
            const mailingAddressColumn = this.createObjectByColumnDef<OsirisMailingAddressColumn>((raw as unknown[]), OsirisMailingAddressColumnKeys);
            const legalRepresentativeColumn = this.createObjectByColumnDef<OsirisLegalRepresentativeColumn>((raw as unknown[]), OsirisLegalRepresentativeColumnKeys);
            const actionsNumberColumn = this.createObjectByColumnDef<OsirisActionsNumberColumn>((raw as unknown[]), OsirisActionsNumberColumnKeys);
            const amountColumn = this.createObjectByColumnDef<OsirisAmountsColumn>((raw as unknown[]), OsirisAmountsColumnKeys);
            const paymentsColumn = this.createObjectByColumnDef<OsirisPaymentsColumn>((raw as unknown[]), OsirisPaymentsColumnKeys);
            const evaluationColumn = this.createObjectByColumnDef<OsirisEvaluationColumn>((raw as unknown[]), OsirisEvaluationColumnKeys);
            const commentsColumn = this.createObjectByColumnDef<OsirisCommentsColumn>((raw as unknown[]), OsirisCommentsColumnKeys);

            return new OsirisFolderEntity(
                folderColumn,
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

    private static createObjectByColumnDef<T>(raw: unknown[], columnKeys: { [key: string] : number}): T {
        return Object.entries(columnKeys).reduce((acc, [key, value]) => {
            acc[key] = raw[value];
            return acc;
        }, {} as { [key: string] : unknown })as unknown as T;
    }
}