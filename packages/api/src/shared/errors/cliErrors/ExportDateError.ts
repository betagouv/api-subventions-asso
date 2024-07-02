class ExportDateError extends Error {
    constructor() {
        super("You must provide a valid export date for this command");
    }
}

export default ExportDateError;
