import { BodaccRecordDto } from "@api-subventions-asso/dto";

export interface BodaccDto {
    total_count: number;
    records: { record: BodaccRecordDto }[];
}
