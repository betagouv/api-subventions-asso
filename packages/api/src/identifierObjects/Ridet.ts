import { IdentifierObject } from "./IdentifierObject";
import Rid from "./Rid";

export const RIDET_NAME = "ridet";

export default class Ridet extends IdentifierObject {
    static isRidet(ridet: string | null | undefined): boolean {
        return typeof ridet === "string" && /^\d{9,10}$/.test(ridet);
    }

    static getName(): typeof RIDET_NAME {
        return RIDET_NAME;
    }

    constructor(ridet: string) {
        if (!Ridet.isRidet(ridet)) {
            throw new Error("Invalid Ridet: " + ridet);
        }
        super(ridet);
    }

    get name(): typeof RIDET_NAME {
        return RIDET_NAME;
    }

    toRid() {
        return new Rid(this.identifier.slice(0, -3));
    }
}
