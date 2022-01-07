import xlsx from 'node-xlsx';

import OsirisActionEntity from './entities/OsirisActionEntity';
import OsirisRequestEntity from './entities/OsirisRequestEntity';

export default class OsirisParser {
    public static parseRequests(content: Buffer): OsirisRequestEntity[] {
        const xls = xlsx.parse(content);
        const data = xls[0].data.filter((row) => (row as unknown[]).length);
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
                siret: OsirisRequestEntity.indexedLegalInformationsPath.siret.reduce((acc, name) => {
                    return (acc as {[key: string]: unknown})[name];
                }, data as unknown) as string,
                rna: OsirisRequestEntity.indexedLegalInformationsPath.rna.reduce((acc, name) => {
                    return (acc as {[key: string]: unknown})[name];
                }, data as unknown) as string,
                name: OsirisRequestEntity.indexedLegalInformationsPath.name.reduce((acc, name) => {
                    return (acc as {[key: string]: unknown})[name];
                }, data as unknown) as string,
            };

            const indexedInformations = {
                osirisId: OsirisRequestEntity.indexedProviderInformationsPath.osirisId.reduce((acc, name) => {
                    return (acc as {[key: string]: unknown})[name];
                }, data as unknown) as string,
                compteAssoId: OsirisRequestEntity.indexedProviderInformationsPath.compteAssoId.reduce((acc, name) => {
                    return (acc as {[key: string]: unknown})[name];
                }, data as unknown) as string,
            };

            return new OsirisRequestEntity(legalInformations, indexedInformations, data);
        });
    }

    public static parseActions(content: Buffer) {
        const xls = xlsx.parse(content);

        const data = xls[0].data.filter((row) => (row as unknown[]).length);
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

            const indexedInformations = {
                osirisActionId: OsirisActionEntity.indexedInformationsPath.osirisActionId.reduce((acc, name) => {
                    return (acc as {[key: string]: unknown})[name];
                }, data as unknown) as string,
                compteAssoId: OsirisActionEntity.indexedInformationsPath.compteAssoId.reduce((acc, name) => {
                    return (acc as {[key: string]: unknown})[name];
                }, data as unknown) as string,
            };

            return new OsirisActionEntity(indexedInformations, data);
        });
    }

    private static findMainCategory(headers: string[][], position: number, defaultMainCategory = OsirisActionEntity.defaultMainCategory) {
        const findLastHeader = (position: number): string => {
            if (position < 0) return defaultMainCategory;
            return headers[0][position] || findLastHeader(position - 1);
        }

        return (headers[0][position] || findLastHeader(position));
    }

    private static findCategory(headers: unknown[][], position: number): string {
        return headers[1][position] as string;
    }
}