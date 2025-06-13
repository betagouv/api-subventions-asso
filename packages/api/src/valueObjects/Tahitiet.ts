import Tahiti from "./Tahiti";

export const TAHITIET_NAME = "tahitiet"; // tahitiet was defined by us because tahiti numbers doesn't have any name for their establishment identifier name (like siren - siret)

export default class Tahitiet {
    private tahitiet: string;

    constructor(tahitiet: string) {
        if (!Tahitiet.isTahitiet(tahitiet)) {
            throw new Error("Invalid Tahitiet: " + tahitiet);
        }

        this.tahitiet = tahitiet;
    }

    static isTahitiet(tahitiet: string | undefined): boolean {
        const regex = /^[A-Z0-9][0-9]{8}$/i;
        return typeof tahitiet === "string" && regex.test(tahitiet);
    }

    static getName(): "tahitiet" {
        return TAHITIET_NAME;
    }

    get name(): "tahitiet" {
        return TAHITIET_NAME;
    }

    get value() {
        return this.tahitiet;
    }

    toTahiti() {
        return new Tahiti(this.tahitiet.slice(0, -3));
    }
}
