import Rid from "./Rid";

export default class Ridet {
    private ridet: string;

    constructor(ridet: string) {
        if (!Ridet.isRidet(ridet)) {
            throw new Error("Invalid Ridet: " + ridet);
        }
        this.ridet = ridet;
    }

    static isRidet(ridet: string | undefined): boolean {
        return typeof ridet === "string" && (/^\d{10}$/.test(ridet) || /^\d{9}$/.test(ridet));
    }

    get value() {
        return this.ridet;
    }

    toRid() {
        return new Rid(this.ridet.slice(0, -3));
    }
}
