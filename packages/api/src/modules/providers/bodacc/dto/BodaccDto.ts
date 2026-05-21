import { BodaccRecordDtoSnakeCase } from "dto";

export interface BodaccDto {
    total_count: number;
    records: { record: BodaccRecordDtoSnakeCase }[];
}
