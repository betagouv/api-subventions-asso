import { DefaultObject } from "../../../../@types";
import MiscScdlGrantEntity from "../entities/MiscScdlGrantEntity";

export interface ScdlGrantDbo extends MiscScdlGrantEntity {
    _id: string;
    __data__: DefaultObject<string>;
}
