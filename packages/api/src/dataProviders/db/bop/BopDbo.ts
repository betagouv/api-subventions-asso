import { ObjectId } from "mongodb";

export default interface BopDbo {
    _id: ObjectId;
    label: string;
    code: string;
}
