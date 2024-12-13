export default class Thaiti {
    private thaiti: string;

    constructor(thaiti: string) {
        if (!Thaiti.isThaiti(thaiti)) {
            throw new Error("Invalid Thaiti: " + thaiti);
        }

        this.thaiti = thaiti;
    }

    static isThaiti(thaiti: string | undefined): boolean {
        const regex = /^[A-Z0-9][0-9]{5}$/i;
        return typeof thaiti === "string" && regex.test(thaiti);
    }

    get value() {
        return this.thaiti;
    }
}
