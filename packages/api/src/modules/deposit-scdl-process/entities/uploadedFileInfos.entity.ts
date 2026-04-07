import ScdlErrorStats from "./ScdlErrorStats";
import { MissingHeaders } from "../../providers/scdl/@types/MissingHeaders";
import ExerciceLineCount from "./exerciceLineCount";

export default class UploadedFileInfosEntity {
    constructor(
        public fileName: string,
        public uploadDate: Date,
        public allocatorsSiret: string[],
        public grantCoverageYears: number[],
        public parseableLines: number,
        public totalLines: number,
        public lineCountsByExercice: ExerciceLineCount[],
        public missingHeaders: MissingHeaders,
        public existingLinesInDbOnSamePeriod: number,
        public errorStats: ScdlErrorStats,
        public sheetName?: string,
        public processedExercices?: number[],
    ) {}
}
