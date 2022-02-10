import { ObjectId } from "mongodb";
import { ParserInfo } from "../../../@types/ParserInfo";
import IChorusIndexedInformations from "../@types/IChorusIndexedInformations";

export default class ChorusLineEntity {
    public provider = "Chorus";

    public static indexedInformationsPath: {[key: string]: ParserInfo} = {
        ej: {
            path: ["N° EJ"],
        },
        siret: { path: ['Code taxe 1'] },
        compte: { path: ['Compte général'] }, 
        amount: { 
            path: ["EUR"],
            adapter: (value) => {
                if (!value) return value;
                return parseFloat(value.replace("\r", "").replace(" ", ''))
            }
        }, 
        dateOperation: { 
            path: ["Date de dernière opération sur la DP"],
            adapter: (value) => {
                if (!value) return value;

                const [day, month, year] = value.split('.').map(v => parseInt(v, 10));
                return new Date(year, month - 1, day);
            }
        }, 
    }

    constructor(
        public indexedInformations: IChorusIndexedInformations,
        public data: unknown,
        public _id?: ObjectId
    ) {}
}
