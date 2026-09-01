import { EstablishmentEntity } from "../../../../domain/structures/establishments/EstablishmentEntity";
import { Siren } from "../../../../identifier-objects";
import SireneEstablishmentDto from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.dto";

export interface SireneEstablishmentPort {
    upsertMany(dtos: SireneEstablishmentDto[]): Promise<number>;
    getAllBySiren(siren: Siren): Promise<EstablishmentEntity[]>;
}
