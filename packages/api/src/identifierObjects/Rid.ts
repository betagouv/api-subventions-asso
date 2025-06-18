import { IdentifierObject } from "./IdentifierObject";

export const RID_NAME = "rid";

export default class Rid extends IdentifierObject {
    static isRid(rid: string | undefined): boolean {
        return typeof rid === "string" && /^\d{6,7}$/.test(rid);
    }

    static getName(): typeof RID_NAME {
        return RID_NAME;
    }

    constructor(rid: string) {
        if (!Rid.isRid(rid)) {
            throw new Error("Invalid Rid: " + rid);
        }
        super(rid);
    }

    get name(): typeof RID_NAME {
        return RID_NAME;
    }
}
