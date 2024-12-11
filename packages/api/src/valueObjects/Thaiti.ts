export default class Thaiti {
    private thaiti: string;

    constructor(thaiti: string) {
        if (!Thaiti.isThaiti(thaiti)) {
            throw new Error("Invalid Thaiti: " + thaiti);
        }

        this.thaiti = thaiti;
    }

    static isThaiti(thaiti: string | undefined): boolean {
        const regex1 = /^[A-Z][0-9]{5}$/i; // Regex : 1 lettre + 5 chiffres
        const regex2 = /^\d{6}$/; // Regex : 6 chiffres
        return typeof thaiti === "string" && (regex1.test(thaiti) || regex2.test(thaiti));
    }

    get value() {
        return this.thaiti;
    }
}
