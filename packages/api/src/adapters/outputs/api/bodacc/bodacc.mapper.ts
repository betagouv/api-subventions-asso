import { BodaccRecordEntity } from "../../../../domain/structures/associations/BodaccRecordEntity";
import { BodaccRecordDto } from "./bodacc.dto";

export const toEntity = (dto: BodaccRecordDto): BodaccRecordEntity => {
    return new BodaccRecordEntity({
        id: dto.fields.id,
        famille: dto.fields.familleavis_lib,
        type: dto.fields.typeavis_lib,
        dateParution: dto.fields.dateparution,
        tribunal: dto.fields.tribunal,
        jugement: dto.fields.jugement,
        departement: { numero: Number(dto.fields.numerodepartement), nom: dto.fields.departement_nom_officiel },
        region: { numero: dto.fields.region_code, nom: dto.fields.region_nom_officiel },
    });
};
