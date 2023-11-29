export default class HistoryUniteLegalImportEntity {
    constructor(
        public filename: string,
        public dateOfFile: Date,
        public dateOfImport: Date,
        public id?: string
    ) {}
}