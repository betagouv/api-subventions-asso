import { ObjectId } from "mongodb";

export class ConsumerToken {
    public _id: ObjectId
    public userId: ObjectId
    public token: string

    constructor(userId, token) {
        this.userId = userId;
        this.token = token;
        this._id = new ObjectId()
    }
}