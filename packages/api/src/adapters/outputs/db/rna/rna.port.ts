import { RnaImportDto } from "./RnaImportDto";

export interface RnaPort {
    insertMany(lines: RnaImportDto[]): Promise<void>;
}
