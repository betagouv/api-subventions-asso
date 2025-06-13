export const RNA_NAME = "rna";

export default class Rna {
    private rna: string;

    constructor(rna: string) {
        if (!Rna.isRna(rna)) {
            throw new Error("Invalid RNA: " + rna);
        }

        this.rna = rna;
    }

    static isRna(rna: string | undefined): boolean {
        return typeof rna === "string" && /^W\d[A-Z\d]\d{7}$/.test(rna);
    }

    static getName(): "rna" {
        return RNA_NAME;
    }

    get name(): "rna" {
        return RNA_NAME;
    }

    get value() {
        return this.rna;
    }

    toString() {
        return this.value;
    }

    equals(other: Rna) {
        return other.value === this.value;
    }
}
