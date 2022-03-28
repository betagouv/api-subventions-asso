import { ObjectId } from "mongodb";
import { ParserInfo } from "../../../../@types";
import IChorusIndexedInformations from "../@types/IChorusIndexedInformations";

export default class ChorusLineEntity {
    public provider = "Chorus";

    public static indexedInformationsPath: {[key: string]: ParserInfo} = {
        ej: {
            path: ["N° EJ"],
        },
        siret: { path: ['Code taxe 1'] },
        compte: { path: ['Compte général'] }, 
        codeBranche: { path: ['Branche CODE'] }, 
        branche: { path: ['Branche'] }, 
        typeOperation: { path: ['Type d\'opération CODE', "Grpe cptes fourniss. CODE"] }, 
        amount: { 
            path: ["EUR"],
            adapter: (value) => {
                if (!value) return value;

                return parseFloat(value.replace("\r", "").replace(" ", '').replace(",", "."))
            }
        }, 
        dateOperation: { 
            path: ["Date de dernière opération sur la DP"],
            adapter: (value) => {
                if (!value) return value;

                const [day, month, year] = value.split('.').map(v => parseInt(v, 10));
                return new Date(Date.UTC(year, month - 1, day));
            }
        }, 
    }

    constructor(
        public uniqueId: string,
        public indexedInformations: IChorusIndexedInformations,
        public data: unknown,
        public _id?: ObjectId
    ) {}
}
