import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import ILegalInformations from "../../search/@types/ILegalInformations";
import { SubventiaRequestEntity } from "./entities/SubventiaRequestEntity";
import ISubventiaIndexedInformation from "./@types/ISubventiaIndexedInformation";

export default class SubventiaParser {
    static parse(fileContent: Buffer): SubventiaRequestEntity[] {
        const data = ParseHelper.xlsParse(fileContent)[0];
        const headers = data[0] as string[];
        const raws = data.slice(1) as unknown[][];

        return raws.map(raw => {
            const parsedData = ParseHelper.linkHeaderToData(headers, raw);
            const indexedInformations = ParseHelper.indexDataByPathObject(
                SubventiaRequestEntity.indexedProviderInformationsPath,
                parsedData,
            ) as unknown as ISubventiaIndexedInformation;
            const legalInformations = ParseHelper.indexDataByPathObject(
                SubventiaRequestEntity.indexedLegalInformationsPath,
                parsedData,
            ) as unknown as ILegalInformations;

            return new SubventiaRequestEntity(legalInformations, indexedInformations, parsedData);
        });
    }
}
