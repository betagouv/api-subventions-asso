import Siret from "./Siret";

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
