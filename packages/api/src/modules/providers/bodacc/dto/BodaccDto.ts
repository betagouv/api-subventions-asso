import { BodaccRecordDto } from "@api-subventions-asso/dto";

export interface BodaccDto {
    total_count: number;
    links: unknown[];
    records: { record: BodaccRecordDto }[];
}
