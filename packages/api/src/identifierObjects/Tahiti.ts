import { IdentifierObject } from "./IdentifierObject";

export const TAHITI_NAME = "tahiti";

export default class Tahiti extends IdentifierObject {
    static isTahiti(tahiti: string | undefined): boolean {
        const regex = /^[A-Z0-9][0-9]{5}$/i;
        return typeof tahiti === "string" && regex.test(tahiti);
    }

    static getName(): "tahiti" {
        return TAHITI_NAME;
    }

    constructor(tahiti: string) {
        if (!Tahiti.isTahiti(tahiti)) {
            throw new Error("Invalid Tahiti: " + tahiti);
        }

        super(tahiti);
    }

    get name(): "tahiti" {
        return TAHITI_NAME;
    }
}
