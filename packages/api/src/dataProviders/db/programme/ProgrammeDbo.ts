import { ObjectId } from "mongodb";

export default interface ProgrammeDbo {
    _id: ObjectId;
    label: string;
    code: string;
}
