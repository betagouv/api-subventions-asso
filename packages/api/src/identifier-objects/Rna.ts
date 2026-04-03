import { IdentifierObject } from "./IdentifierObject";

export const RNA_NAME = "rna";

export default class Rna extends IdentifierObject {
    static isRna(rna: string | undefined): boolean {
        return typeof rna === "string" && /^W\d[A-Z\d]\d{7}$/.test(rna);
    }

    static getName(): "rna" {
        return RNA_NAME;
    }

    constructor(rna: string) {
        if (!Rna.isRna(rna)) {
            throw new Error("Invalid RNA: " + rna);
        }

        super(rna);
    }

    get name(): typeof RNA_NAME {
        return RNA_NAME;
    }
}
