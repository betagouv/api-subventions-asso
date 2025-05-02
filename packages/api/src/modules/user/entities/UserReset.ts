import { ObjectId } from "mongodb";

export default class UserReset {
    constructor(
        public userId: ObjectId,
        public token: string,
        public createdAt: Date,
    ) {}
}
