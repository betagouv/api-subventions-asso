import Rid from "./Rid";

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

    get name(): "ridet" {
        return "ridet";
    }

    get value() {
        return this.ridet;
    }

    toRid() {
        return new Rid(this.ridet.slice(0, -3));
    }
}
