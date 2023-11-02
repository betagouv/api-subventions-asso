import { ObjectId } from "mongodb";
import { ScdlGrantEntity } from "../@types/ScdlGrantEntity";

export interface ScdlGrantDbo extends ScdlGrantEntity {
    // in English as it is internal code
    _id: ObjectId;
    producerId: string;
}
