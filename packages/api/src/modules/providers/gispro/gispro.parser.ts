import GisproRequestEntity from './entities/GisproRequestEntity';
import * as ParserHelper from '../../../shared/helpers/ParserHelper'
import { DefaultObject } from '../../../@types/utils';
import IGisproRequestInformations from './@types/IGisproRequestInformations';
import ILegalInformations from '../../search/@types/ILegalInformations';

export default class GisproParser {
    public static parseRequests(content: Buffer): GisproRequestEntity[] {
        const data = ParserHelper.xlsParse(content)[0]
        const headers = data.slice(0,1).flat() as string[];
        const raws = data.slice(1, data.length ) as unknown[][]; // Delete Headers
        return raws.map((raw) => {
            const data: DefaultObject<string|number> = headers.reduce((acc, header, index) => ({ ...acc, [header]: raw[index] }), {});
            const indexedInformations = ParserHelper.indexDataByPathObject(GisproRequestEntity.indexedProviderInformationsPath, data) as IGisproRequestInformations;
            const legalInformations = ParserHelper.indexDataByPathObject(GisproRequestEntity.indexedLegalInformationsPath, data) as unknown as ILegalInformations;
            return new GisproRequestEntity(legalInformations, indexedInformations, data);
        });
    }
}