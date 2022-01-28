export default class UserReset {
    constructor(
        public email: string,
        public token: string,
        public createdAt: Date
    ) {}
}