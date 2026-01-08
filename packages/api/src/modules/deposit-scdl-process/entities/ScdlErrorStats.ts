import { MixedParsedError } from "../../providers/scdl/@types/Validation";

export default class ScdlErrorStats {
    public count: number;
    public errors: MixedParsedError[];

    constructor(errors: MixedParsedError[]) {
        this.count = errors.length;
        this.errors = errors.slice(0, 1000);
    }
}
