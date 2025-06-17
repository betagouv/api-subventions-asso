import { IdentifierObject } from "./IdentifierObject";
import Siret from "./Siret";

export const SIREN_NAME = "siren";

export default class Siren extends IdentifierObject {
    static isSiren(siren: string | undefined): boolean {
        return typeof siren === "string" && /^\d{9}$/.test(siren);
    }

    static getName(): typeof SIREN_NAME {
        return SIREN_NAME;
    }

    // TODO: why "partialSiret" and not "siret" ?
    static fromPartialSiretStr(siret: string) {
        return new Siren(siret.slice(0, 9));
    }

    constructor(siren: string) {
        if (!Siren.isSiren(siren)) {
            throw new Error("Invalid Siren: " + siren);
        }

        super(siren);
    }

    get name(): typeof SIREN_NAME {
        return SIREN_NAME;
    }

    toSiret(nic: string) {
        return new Siret(this.identifier + nic);
    }
}
