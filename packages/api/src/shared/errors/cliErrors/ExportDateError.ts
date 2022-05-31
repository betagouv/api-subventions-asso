class ExportDateError extends Error {
    constructor() {
        super("You must provide an export date for this command");
    }
}

export default ExportDateError;