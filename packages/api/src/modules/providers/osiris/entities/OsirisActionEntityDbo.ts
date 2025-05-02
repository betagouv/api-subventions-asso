import { ObjectId } from "mongodb";
import IOsirisActionsInformations from "../@types/IOsirisActionsInformations";

export default class OsirisActionEntityDbo {
    constructor(
        public indexedInformations: IOsirisActionsInformations,
        public data: unknown,
        public _id?: ObjectId,
    ) {}
}
