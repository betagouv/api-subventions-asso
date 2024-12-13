import { ObjectId } from "mongodb";

export default interface FonjepDispositifDbo {
    _id: ObjectId;
    ID: number | null;
    Libelle: string | null;
    FinanceurCode: string | null;
}
