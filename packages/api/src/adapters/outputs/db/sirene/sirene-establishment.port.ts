import SireneEstablishmentDto from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.dto";

export interface SireneEstablishmentPort {
    upsertMany(dtos: SireneEstablishmentDto[]): Promise<number>;
}
