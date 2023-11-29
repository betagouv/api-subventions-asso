import { ObjectId } from "mongodb";

export default interface UniteLegalImportDbo {
    filename: string;
    dateOfFile: Date;
    dateOfImport: Date;
    _id: ObjectId
}