import { ObjectId } from "mongodb";

export default interface FonjepTypePosteDbo {
    _id: ObjectId;
    Code: string | null;
    Libelle: string | null;
}
