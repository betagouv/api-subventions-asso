import Thaiti from "./Thaiti";

export default class ThaitiT {
    private thaitiT: string;

    constructor(thaitiT: string) {
        if (!ThaitiT.isThaitiT(thaitiT)) {
            throw new Error("Invalid ThaitiT: " + thaitiT);
        }

        this.thaitiT = thaitiT;
    }

    static isThaitiT(thaitiT: string | undefined): boolean {
        const regex = /^[A-Z0-9][0-9]{8}$/i;
        return typeof thaitiT === "string" && regex.test(thaitiT);
    }

    get value() {
        return this.thaitiT;
    }

    toThaiti() {
        return new Thaiti(this.thaitiT.slice(0, -3));
    }
}
