import { Siren } from "dto";
import { ObjectId } from "mongodb";

export default interface UniteLegalNameDbo {
    siren: Siren;
    name: string;
    searchKey: string;
    updatedDate: Date;
    _id?: ObjectId;
}
