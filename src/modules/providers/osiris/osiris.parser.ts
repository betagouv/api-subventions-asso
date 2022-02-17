import OsirisActionEntity from './entities/OsirisActionEntity';
import OsirisRequestEntity from './entities/OsirisRequestEntity';
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import { Siret } from '../../../@types/Siret';
import { Rna } from '../../../@types/Rna';
import IOsirisRequestInformations from './@types/IOsirisRequestInformations';
import IOsirisActionsInformations from './@types/IOsirisActionsInformations';

export default class OsirisParser {
    public static parseRequests(content: Buffer): OsirisRequestEntity[] {
        const data = ParseHelper.xlsParse(content)[0]
        const headers = data.slice(0,2) as string[][];
        const raws = data.slice(2, data.length - 1) as unknown[][]; // Delete Headers and footers


        return raws.map((raw) => {
            const data: { [key: string]: { [key: string]: unknown} } = {};

            raw.forEach((value, index) => {
                const mainCategory = OsirisParser.findMainCategory(headers, index);
                const category = OsirisParser.findCategory(headers, index);

                if (!data[mainCategory]) data[mainCategory] = {};
                data[mainCategory][category] = value
            });

            const legalInformations = {
                siret: ParseHelper.findByPath<Siret>(data, OsirisRequestEntity.indexedLegalInformationsPath.siret),
                rna: ParseHelper.findByPath<Rna>(data, OsirisRequestEntity.indexedLegalInformationsPath.rna),
                name: ParseHelper.findByPath<string>(data, OsirisRequestEntity.indexedLegalInformationsPath.name),
            };

            const indexedInformations = Object.keys(OsirisRequestEntity.indexedProviderInformationsPath).reduce((acc, key: string) => {
                const tempAcc = (acc as { [key: string ] : string} );
                tempAcc[key] = ParseHelper.findByPath(data, OsirisRequestEntity.indexedProviderInformationsPath[key]);
                return tempAcc;
            }, {} as unknown) as IOsirisRequestInformations;

            return new OsirisRequestEntity(legalInformations, indexedInformations, data);
        });
    }

    public static parseActions(content: Buffer) {
        const data = ParseHelper.xlsParse(content)[0]

        const headers = data.slice(0,2) as string[][];
        
        const raws = data.slice(2, data.length - 1) as unknown[][]; // Delete Headers and footers

        return raws.map((raw: unknown[]) => {
            const data: { [key: string]: { [key: string]: unknown} } = {};

            raw.forEach((value, index) => {
                const mainCategory = OsirisParser.findMainCategory(headers, index);
                const category = OsirisParser.findCategory(headers, index);

                if (!data[mainCategory]) data[mainCategory] = {};
                data[mainCategory][category] = value
            });

            const indexedInformations = Object.keys(OsirisActionEntity.indexedInformationsPath).reduce((acc, key: string) => {
                const tempAcc = (acc as { [key: string ] : string} );
                tempAcc[key] = ParseHelper.findByPath(data, OsirisActionEntity.indexedInformationsPath[key]);
                return tempAcc;
            }, {} as unknown) as IOsirisActionsInformations;

            return new OsirisActionEntity(indexedInformations, data);
        });
    }

    private static findMainCategory(headers: string[][], position: number, defaultMainCategory = OsirisActionEntity.defaultMainCategory) {
        const findLastHeader = (position: number): string => {
            if (position < 0) return defaultMainCategory;
            return headers[0][position] || findLastHeader(position - 1);
        }

        return (headers[0][position] || findLastHeader(position)).trim();
    }

    private static findCategory(headers: unknown[][], position: number): string {
        return (headers[1][position] as string).trim();
    }
}