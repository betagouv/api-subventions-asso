export class MongoCnxError extends Error {
    constructor() {
        super("Connexion to DB lost");
    }
}
