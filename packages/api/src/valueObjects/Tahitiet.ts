import Tahiti from "./Tahiti";

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

    get name() {
        return "tahitiet";
    }

    get value() {
        return this.tahitiet;
    }

    toThaiti() {
        return new Tahiti(this.tahitiet.slice(0, -3));
    }
}
