import { MixedParsedError } from "../../providers/scdl/@types/Validation";

export default class ScdlErrorStats {
    public count: number;
    public errorSample: MixedParsedError[];

    constructor(errors: MixedParsedError[]) {
        this.count = errors.length;
        this.errorSample = errors.slice(0, 1000);
    }
}
