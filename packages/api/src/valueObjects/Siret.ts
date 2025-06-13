import Siren from "./Siren";

export const SIRET_NAME = "siret";

export default class Siret {
    private siret: string;

    constructor(siret: string) {
        if (!Siret.isSiret(siret)) {
            throw new Error("Invalid Siret : " + siret);
        }

        this.siret = siret;
    }

    static isSiret(siret: string | null | undefined): boolean {
        return typeof siret === "string" && /^\d{14}$/.test(siret);
    }

    static getName(): "siret" {
        return SIRET_NAME;
    }

    get name(): "siret" {
        return SIRET_NAME;
    }

    get value() {
        return this.siret;
    }

    toString() {
        return this.value;
    }

    equals(other: Siret) {
        return other.value === this.value;
    }

    toSiren() {
        return new Siren(this.siret.slice(0, 9));
    }

    static isStartOfSiret(siret: string | undefined): boolean {
        return typeof siret === "string" && /^\d{9,14}/.test(siret);
    }
}
