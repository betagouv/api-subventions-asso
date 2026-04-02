import OsirisRequestEntity from "../../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import Siret from "../../../../../identifierObjects/Siret";
import Rna from "../../../../../identifierObjects/Rna";
import Siren from "../../../../../identifierObjects/Siren";
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
