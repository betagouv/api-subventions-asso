import { ObjectId } from "mongodb";

export default interface UniteLegaleNameDbo {
    siren: string;
    name: string;
    searchKey: string;
    updatedDate: Date;
    _id?: ObjectId;
}
