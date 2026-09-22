import AssociationSearchDbo from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import SireneEstablishmentDto from "./sirene-establishment.dto";

export class SireneEstablishmentMapper {
    static toAssociationSearch(dto: SireneEstablishmentDto) {
        return {
            siren: dto.siren,
            address: {
                number: dto.numeroVoieEtablissement,
                type: dto.typeVoieEtablissement,
                name: dto.libelleVoieEtablissement,
                city: dto.libelleCommuneEtablissement,
                postalCode: dto.codePostalEtablissement,
            },
        } as Pick<AssociationSearchDbo, "siren" | "address">;
    }
}
