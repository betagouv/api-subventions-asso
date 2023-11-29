import { ObjectId } from "mongodb"
import { Rna, Siren } from "dto";

export default interface RnaSirenDbo {
    siren: Siren,
    rna: Rna,
    _id: ObjectId
}