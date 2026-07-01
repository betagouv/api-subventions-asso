import { ObjectId } from "mongodb";

export class ConsumerToken {
    public _id: ObjectId;
    public userId: ObjectId;
    public token: string;

    constructor(userId: string, token: string) {
        this.userId = new ObjectId(userId);
        this.token = token;
        this._id = new ObjectId();
    }
}
