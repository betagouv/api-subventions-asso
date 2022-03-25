import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import IChorusIndexedInformations from "./@types/IChorusIndexedInformations";
import ChorusLineEntity from "./entities/ChorusLineEntity";

export default class ChorusParser {

    public static parse(content: Buffer) {
        const data = content
            .toString()
            .replace(/"/g, '')
            .replace("", '')
            .split("\n") // Select line by line
            .map(raw => raw.split(";").map(r => r.split("\t")).flat()) // Parse column
        
        const headers = data.splice(0,7);

        headers[6].forEach((header, index) => {
            const isCode = headers[6].slice(index + 1).find(h => h === header);
            if (isCode) {
                headers[6][index] = `${header} CODE`;
            }
        })

        return data.reduce((entities, raw) => {
            if (!raw.map(column => column.trim()).filter(c => c).length) return entities;
            const parsedData = ParseHelper.linkHeaderToData(headers[6], raw);
            
            const indexedInformations = ParseHelper.indexDataByPathObject(ChorusLineEntity.indexedInformationsPath, parsedData) as unknown as IChorusIndexedInformations;

            return entities.concat(new ChorusLineEntity(
                this.buildUniqueId(indexedInformations),
                indexedInformations,
                parsedData    
            ))
        }, [] as ChorusLineEntity[]);
    }

    private static buildUniqueId(indexedInformations: IChorusIndexedInformations): string {
        return `${indexedInformations.siret}-${indexedInformations.ej}-${indexedInformations.dateOperation}-${indexedInformations.amount}`;
    }
}