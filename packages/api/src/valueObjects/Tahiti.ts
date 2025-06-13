export const TAHITI_NAME = "tahiti";

export default class Tahiti {
    private tahiti: string;

    constructor(tahiti: string) {
        if (!Tahiti.isTahiti(tahiti)) {
            throw new Error("Invalid Tahiti: " + tahiti);
        }

        this.tahiti = tahiti;
    }

    static isTahiti(tahiti: string | undefined): boolean {
        const regex = /^[A-Z0-9][0-9]{5}$/i;
        return typeof tahiti === "string" && regex.test(tahiti);
    }

    static getName(): "tahiti" {
        return TAHITI_NAME;
    }

    get name(): "tahiti" {
        return TAHITI_NAME;
    }

    get value() {
        return this.tahiti;
    }
}
