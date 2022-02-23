import OsirisActionEntity from './entities/OsirisActionEntity';
import OsirisRequestEntity from './entities/OsirisRequestEntity';
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import IOsirisRequestInformations from './@types/IOsirisRequestInformations';
import IOsirisActionsInformations from './@types/IOsirisActionsInformations';
import { DefaultObject } from '../../../@types/utils';
import ILegalInformations from '../../search/@types/ILegalInformations';

export default class OsirisParser {
    public static parseRequests(content: Buffer): OsirisRequestEntity[] {
        const data = ParseHelper.xlsParse(content)[0]
        const headers = data.slice(0,2) as string[][];
        const raws = data.slice(2, data.length - 1) as unknown[][]; // Delete Headers and footers


        return raws.map((raw) => {
            const data: DefaultObject<DefaultObject<string|number>> = OsirisParser.rawToRawWithHeaders(headers, raw);

            const indexedInformations = ParseHelper.indexDataByPathObject(OsirisRequestEntity.indexedProviderInformationsPath, data) as IOsirisRequestInformations;
            const legalInformations = ParseHelper.indexDataByPathObject(OsirisRequestEntity.indexedLegalInformationsPath, data) as unknown as ILegalInformations;

            return new OsirisRequestEntity(legalInformations, indexedInformations, data);
        });
    }

    public static parseActions(content: Buffer) {
        const data = ParseHelper.xlsParse(content)[0]

        const headers = data.slice(0,2) as string[][];
        
        const raws = data.slice(2, data.length - 1) as unknown[][]; // Delete Headers and footers

        return raws.map((raw: unknown[]) => {
            const data: DefaultObject<DefaultObject<string|number>> = OsirisParser.rawToRawWithHeaders(headers, raw);

            const indexedInformations = ParseHelper.indexDataByPathObject(OsirisActionEntity.indexedInformationsPath, data) as unknown as IOsirisActionsInformations;

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

    private static rawToRawWithHeaders(headers: string[][], raw: unknown[]) {
        const data: DefaultObject<DefaultObject<string|number>> = {};

        raw.forEach((value, index) => {
            const mainCategory = OsirisParser.findMainCategory(headers, index);
            const category = OsirisParser.findCategory(headers, index);

            if (!data[mainCategory]) data[mainCategory] = {};
            data[mainCategory][category] = value as string;
        });

        return data
    }
}