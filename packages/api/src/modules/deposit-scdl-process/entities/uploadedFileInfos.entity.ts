import ScdlErrorStats from "./ScdlErrorStats";

export default class UploadedFileInfosEntity {
    constructor(
        public fileName: string,
        public uploadDate: Date,
        public allocatorsSiret: string[],
        public grantCoverageYears: number[],
        public parseableLines: number,
        public totalLines: number,
        public existingLinesInDbOnSamePeriod: number,
        public errorStats: ScdlErrorStats,
        public sheetName?: string,
    ) {}
}
