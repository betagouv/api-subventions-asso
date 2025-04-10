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

    get name(): "tahiti" {
        return "tahiti";
    }

    get value() {
        return this.tahiti;
    }
}
