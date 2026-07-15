import SireneEstablishmentDto from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.dto";

export interface SireneEstablishmentPort {
    saveNewer(dtos: SireneEstablishmentDto[]): Promise<number>;
}
