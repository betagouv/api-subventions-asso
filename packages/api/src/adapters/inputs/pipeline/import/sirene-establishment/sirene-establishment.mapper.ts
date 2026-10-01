import AssociationSearchDbo from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import { AssociationSearchFields } from "./sirene-establishment.dto";

export class SireneEstablishmentMapper {
    static toAssociationSearch(dto: AssociationSearchFields) {
        return {
            siren: dto.siren,
            address: {
                number: dto.numeroVoieEtablissement,
                type: dto.typeVoieEtablissement,
                name: dto.libelleVoieEtablissement,
                city: dto.libelleCommuneEtablissement,
                postalCode: dto.codePostalEtablissement,
            },
        } as Required<Pick<AssociationSearchDbo, "siren" | "address">>;
    }
}
