export default class Rid {
    private rid: string;

    constructor(rid: string) {
        if (!Rid.isRid(rid)) {
            throw new Error("Invalid Rid: " + rid);
        }
        this.rid = rid;
    }

    static isRid(rid: string | undefined): boolean {
        return typeof rid === "string" && (/^\d{7}$/.test(rid) || /^\d{6}$/.test(rid));
    }

    get value() {
        return this.rid;
    }
}
