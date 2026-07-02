import { ObjectId } from "mongodb";

export default class UserReset {
    public userId: ObjectId;

    constructor(
        userId: string,
        public token: string,
        public createdAt: Date,
    ) {
        // @TODO: change userId type to string
        this.userId = new ObjectId(userId);
    }
}
