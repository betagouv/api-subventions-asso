import Siret from "./Siret";

export const SIREN_NAME = "siren";

export default class Siren {
    private siren: string;

    constructor(siren: string) {
        if (!Siren.isSiren(siren)) {
            throw new Error("Invalid Siren: " + siren);
        }

        this.siren = siren;
    }

    static isSiren(siren: string | undefined): boolean {
        return typeof siren === "string" && /^\d{9}$/.test(siren);
    }

    static fromPartialSiretStr(siret: string) {
        return new Siren(siret.slice(0, 9));
    }

    static getName(): "siren" {
        return SIREN_NAME;
    }
    get name(): "siren" {
        return SIREN_NAME;
    }

    get value() {
        return this.siren;
    }

    toString() {
        return this.value;
    }

    equals(other: Siren) {
        return other.value === this.value;
    }

    toSiret(nic: string) {
        return new Siret(this.siren + nic);
    }
}
