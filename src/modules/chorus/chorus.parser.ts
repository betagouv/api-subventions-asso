import * as ParseHelper from "../../shared/helpers/ParserHelper";
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

        return data.reduce((entities, raw) => {
            if (!raw.map(column => column.trim()).filter(c => c).length) return entities;
            const parsedData = headers[6].reduce((acc, header, key) => {
                acc[header.trim()] = raw[key];
                return acc;
            }, {} as {[key: string]: string});
            
            const indexedInformations = Object.keys(ChorusLineEntity.indexedInformationsPath).reduce((acc, key: string) => {
                const tempAcc = (acc as { [key: string ] : string} );
                tempAcc[key] = ParseHelper.findByPath(parsedData, ChorusLineEntity.indexedInformationsPath[key]);
                return tempAcc;
            }, {} as unknown) as IChorusIndexedInformations;

            return entities.concat(new ChorusLineEntity(
                indexedInformations,
                parsedData    
            ))
        }, [] as ChorusLineEntity[]);
    }
}