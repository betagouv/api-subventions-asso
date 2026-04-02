export class UserUpdateError extends Error {
    static message = "An error has occured on user update";
    constructor() {
        super(UserUpdateError.message);
    }
}
