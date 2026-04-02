import OsirisActionEntity from "../../../../../modules/providers/osiris/entities/OsirisActionEntity";
import Siren from "../../../../../identifier-objects/Siren";
import { BulkUpsertResult } from "../../@types/bulk-upsert-result";

export interface OsirisActionPort {
    createIndexes(): Promise<void>;

    add(osirisAction: OsirisActionEntity): Promise<OsirisActionEntity>;
    update(osirisAction: OsirisActionEntity): Promise<OsirisActionEntity>;
    bulkUpsert(osirisActions: OsirisActionEntity[]): Promise<BulkUpsertResult>;
    findByRequestUniqueId(requestUniqueId: string): Promise<OsirisActionEntity[]>;
    findBySiren(siren: Siren): Promise<OsirisActionEntity[]>;
}
