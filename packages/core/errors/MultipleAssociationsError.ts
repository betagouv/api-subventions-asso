import { SearchErrorCodes } from "../enums/SearchErrorCodes";
import { BadRequestError } from "./httpErrors";

export class MultipleAssociationsError extends BadRequestError {
    constructor() {
        super(
            "Multiple associations found with this identifier, please use a more specific one",
            SearchErrorCodes.MULTIPLE_ASSOS,
        );
    }
}
