import { BodaccRecordEntity } from "../../../../domain/structures/associations/BodaccRecordEntity";
import { Siren } from "../../../../identifier-objects";

export interface BodaccPort {
    getRecordsBySiren(siren: Siren): Promise<BodaccRecordEntity[]>;
}
