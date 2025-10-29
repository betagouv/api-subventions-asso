import { MixedParsedError } from "../../providers/scdl/@types/Validation";

export default class UploadedFileInfosEntity {
    constructor(
        public fileName: string,
        public uploadDate: Date,
        public allocatorSiret: string[],
        public errors?: MixedParsedError[],
        public beginPaymentDate?: Date,
        public endPaymentDate?: Date,
        public parseableLines?: number,
        public existingLinesInDbOnSamePeriod?: number,
    ) {}
}
