import { Siren } from "dto"
import { ObjectId } from "mongodb"

export interface UniteLegalEntrepriseDbo {
    siren: Siren,
    _id: ObjectId
}