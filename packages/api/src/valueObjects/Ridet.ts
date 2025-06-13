import Rid from "./Rid";

export const RIDET_NAME = "ridet";

export default class Ridet {
    private ridet: string;

    constructor(ridet: string) {
        if (!Ridet.isRidet(ridet)) {
            throw new Error("Invalid Ridet: " + ridet);
        }
        this.ridet = ridet;
    }

    static isRidet(ridet: string | null | undefined): boolean {
        return typeof ridet === "string" && /^\d{9,10}$/.test(ridet);
    }

    static getName(): "ridet" {
        return RIDET_NAME;
    }

    get name(): "ridet" {
        return RIDET_NAME;
    }

    get value() {
        return this.ridet;
    }

    toRid() {
        return new Rid(this.ridet.slice(0, -3));
    }
}
