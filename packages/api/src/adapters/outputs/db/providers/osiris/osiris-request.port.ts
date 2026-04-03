import OsirisRequestEntity from "../../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import Siret from "../../../../../identifier-objects/Siret";
import Rna from "../../../../../identifier-objects/Rna";
import Siren from "../../../../../identifier-objects/Siren";
import { BulkUpsertResult } from "../../@types/bulk-upsert-result";

export interface OsirisRequestPort {
    createIndexes(): Promise<void>;

    add(osirisRequest: OsirisRequestEntity): Promise<void>;
    update(osirisRequest: OsirisRequestEntity): Promise<OsirisRequestEntity>;
    bulkUpsert(osirisRequests: OsirisRequestEntity[]): Promise<BulkUpsertResult>;
    findBySiret(siret: Siret): Promise<OsirisRequestEntity[]>;
    findByRna(rna: Rna): Promise<OsirisRequestEntity[]>;
    findBySiren(siren: Siren): Promise<OsirisRequestEntity[]>;
    findAll(): Promise<OsirisRequestEntity[]>;
}
