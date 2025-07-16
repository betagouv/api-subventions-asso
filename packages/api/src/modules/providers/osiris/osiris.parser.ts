import { DefaultObject } from "../../../@types";
import ILegalInformations from "../../search/@types/ILegalInformations";
import { GenericParser } from "../../../shared/GenericParser";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import IOsirisRequestInformations from "./@types/IOsirisRequestInformations";
import IOsirisActionsInformations from "./@types/IOsirisActionsInformations";

export default class OsirisParser {
    public static parseRequests(content: Buffer, year: number): OsirisRequestEntity[] {
        const data = GenericParser.xlsParse(content)[0];
        const headers = data.slice(0, 2) as string[][];
        const rows = data.slice(2, data.length - 1) as unknown[][]; // Delete Headers and footers

        return rows.map(row => {
            const data: DefaultObject<DefaultObject<string | number>> = OsirisParser.rowToRowWithHeaders(
                headers,
                row,
                OsirisRequestEntity.defaultMainCategory,
            ) as DefaultObject<DefaultObject<string | number>>;

            data.Dossier["Exercice Budgetaire"] = year; // create artificial column to match IOsirisRequestInformations

            const indexedInformations = GenericParser.indexDataByPathObject<string | number>(
                OsirisRequestEntity.indexedProviderInformationsPath,
                data,
            ) as IOsirisRequestInformations;
            const legalInformations = GenericParser.indexDataByPathObject(
                OsirisRequestEntity.indexedLegalInformationsPath,
                data,
            ) as unknown as ILegalInformations;

            return new OsirisRequestEntity(legalInformations, indexedInformations, data);
        });
    }

    public static parseActions(content: Buffer, year: number) {
        const data = GenericParser.xlsParse(content)[0];

        const headers = data.slice(0, 2) as string[][];

        const rows = data.slice(2, data.length - 1) as unknown[][]; // Delete Headers and footers

        return rows.map((row: unknown[]) => {
            const data: DefaultObject<DefaultObject<string | number>> = OsirisParser.rowToRowWithHeaders(
                headers,
                row,
                OsirisActionEntity.defaultMainCategory,
            ) as DefaultObject<DefaultObject<string | number>>;
            const dossier = data["Dossier/action"] || data["Dossier"];

            dossier["Exercice Budgetaire"] = year; // add artificial column to match IOsirisActionsInformations

            const indexedInformations = GenericParser.indexDataByPathObject(
                OsirisActionEntity.indexedInformationsPath,
                data,
            ) as unknown as IOsirisActionsInformations;

            return new OsirisActionEntity(indexedInformations, data);
        });
    }

    private static findMainCategory(headers: string[][], position: number, defaultMainCategory: string) {
        const findLastHeader = (position: number): string => {
            if (position < 0) return defaultMainCategory;
            return headers[0][position] || findLastHeader(position - 1);
        };

        return (headers[0][position] || findLastHeader(position)).trim();
    }

    private static findCategory(headers: unknown[][], position: number): string {
        return (headers[1][position] as string).trim();
    }

    private static rowToRowWithHeaders(headers: string[][], row: unknown[], defaultMainCategory: string) {
        const data: DefaultObject<DefaultObject<string | number>> = {};

        row.forEach((value, index) => {
            const mainCategory = OsirisParser.findMainCategory(headers, index, defaultMainCategory);
            const category = OsirisParser.findCategory(headers, index);

            if (!data[mainCategory]) data[mainCategory] = {};
            data[mainCategory][category] = value as string;
        });

        return data;
    }
}
