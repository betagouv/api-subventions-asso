import { ObjectId } from "mongodb";

export default interface UniteLegalNameDbo {
    siren: string;
    name: string;
    searchKey: string;
    updatedDate: Date;
    _id?: ObjectId;
}
