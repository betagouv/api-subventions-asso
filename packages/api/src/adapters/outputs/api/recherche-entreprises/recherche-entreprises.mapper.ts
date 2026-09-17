import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import Rna from "../../../../identifier-objects/Rna";
import Siren from "../../../../identifier-objects/Siren";
import { RechercheEntreprisesResultDto } from "./@types/RechercheEntreprisesDto";

export class RechercheEntreprisesMapper {
    static toAssociationSearchEntity(dto: RechercheEntreprisesResultDto & { nom_complet: string; siren: string }) {
        return new AssociationSearchEntity({
            name: dto.nom_complet,
            siren: new Siren(dto.siren),
            rna: dto.complements?.identifiant_association
                ? new Rna(dto.complements?.identifiant_association)
                : undefined,
            address: dto.siege
                ? {
                      number: dto.siege.numero_voie || null,
                      type: dto.siege.type_voie || null,
                      name: dto.siege.libelle_voie || null,
                      postalCode: dto.siege.code_postal || null,
                      city: dto.siege.libelle_commune || null,
                      complement: null,
                  }
                : undefined,
            nbEstabs: dto.nombre_etablissements || undefined,
        });
    }
}
