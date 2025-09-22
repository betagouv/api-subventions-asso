import { IdentifierObject } from "./IdentifierObject";
import Siren from "./Siren";

export const SIRET_NAME = "siret";

export default class Siret extends IdentifierObject {
    static isSiret(siret: string | null | undefined): boolean {
        return typeof siret === "string" && /^\d{14}$/.test(siret);
    }

    static getName(): "siret" {
        return SIRET_NAME;
    }

    static isStartOfSiret(siret: string | undefined): boolean {
        return typeof siret === "string" && /^\d{9,14}/.test(siret);
    }

    constructor(siret: string) {
        if (!Siret.isSiret(siret)) {
            throw new Error("Invalid Siret : " + siret);
        }

        super(siret);
    }

    get name(): typeof SIRET_NAME {
        return SIRET_NAME;
    }

    toSiren() {
        return new Siren(this.identifier.slice(0, 9));
    }

    static getNic(siret: string) {
        if (!Siret.isSiret(siret)) {
            throw new Error("Invalid Siret : " + siret);
        }
        return siret.slice(9, 14);
    }
}
