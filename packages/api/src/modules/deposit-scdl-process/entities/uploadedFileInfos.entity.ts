import { MixedParsedError } from "../../providers/scdl/@types/Validation";

export default class UploadedFileInfosEntity {
    constructor(
        public fileName: string,
        public uploadDate: Date,
        public allocatorsSiret: string[],
        public grantCoverageYears: number[],
        public parseableLines: number,
        public totalLines: number,
        public existingLinesInDbOnSamePeriod: number,
        public errors: MixedParsedError[],
    ) {}
}
