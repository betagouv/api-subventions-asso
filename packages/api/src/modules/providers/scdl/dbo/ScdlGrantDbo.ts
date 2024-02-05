import { ObjectId } from "mongodb";
import { ScdlGrantEntity } from "../@types/ScdlGrantEntity";
import { DefaultObject } from "../../../../@types";

export interface ScdlGrantDbo extends ScdlGrantEntity {
    // in English as it is internal code
    _id: ObjectId;
    producerId: string;
    __data__: DefaultObject<string>;
}
