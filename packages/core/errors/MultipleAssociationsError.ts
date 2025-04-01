import { SearchCodeError } from "dto";
import { BadRequestError } from "./httpErrors";

export class MultipleAssociationsError extends BadRequestError {
    constructor() {
        super(
            "Multiple associations found with this identifier, please use a more specific one",
            SearchCodeError.MULTIPLE_ASSOS,
        );
    }
}
