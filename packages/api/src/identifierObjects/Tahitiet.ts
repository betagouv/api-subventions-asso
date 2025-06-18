import { IdentifierObject } from "./IdentifierObject";
import Tahiti from "./Tahiti";

export const TAHITIET_NAME = "tahitiet"; // tahitiet was defined by us because tahiti numbers doesn't have any name for their establishment identifier name (like siren - siret)

export default class Tahitiet extends IdentifierObject {
    static isTahitiet(tahitiet: string | undefined): boolean {
        const regex = /^[A-Z0-9][0-9]{8}$/i;
        return typeof tahitiet === "string" && regex.test(tahitiet);
    }

    static getName(): "tahitiet" {
        return TAHITIET_NAME;
    }

    constructor(tahitiet: string) {
        if (!Tahitiet.isTahitiet(tahitiet)) {
            throw new Error("Invalid Tahitiet: " + tahitiet);
        }

        super(tahitiet);
    }

    get name(): "tahitiet" {
        return TAHITIET_NAME;
    }

    toTahiti() {
        return new Tahiti(this.identifier.slice(0, -3));
    }
}
