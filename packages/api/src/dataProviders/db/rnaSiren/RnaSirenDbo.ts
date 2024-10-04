import { ObjectId } from "mongodb";

export default interface RnaSirenDbo {
    siren: string;
    rna: string;
    _id: ObjectId;
}
