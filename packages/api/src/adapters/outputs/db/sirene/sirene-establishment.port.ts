import { EstablishmentEntity } from "../../../../domain/structures/establishments/EstablishmentEntity";
import { Siren } from "../../../../identifier-objects";
import SireneEstablishmentDto from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.dto";
import type AssociationSearchDbo from "../association-search/@types/AssociationSearchDbo";

export type AssociationSearchPostalCodes = Pick<AssociationSearchDbo, "siren"> & { postalCodes: string[] };

export interface SireneEstablishmentPort {
    upsertMany(dtos: SireneEstablishmentDto[]): Promise<number>;
    getAllBySiren(siren: Siren): Promise<EstablishmentEntity[]>;
    computeNbEstab(): AsyncIterable<{ siren: string; nbEstabs: number }>;
    getPostalCodesBySirens(sirens: string[]): Promise<AssociationSearchPostalCodes[]>;
}
