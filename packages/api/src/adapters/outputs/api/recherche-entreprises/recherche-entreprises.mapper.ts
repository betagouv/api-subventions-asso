import { Rna, Siren, Siret } from "../../../../identifier-objects";
import { RechercheEntreprisesResultDto } from "./@types/RechercheEntreprisesDto";

export class RechercheEntreprisesMapper {
    // does not return AssociationSearchEntity has this is old provider and those should be remove soon
    // rna is not ensured and does not match the Entity props parameter types
    static toAssociationSearchEntity(dto: RechercheEntreprisesResultDto & { nom_complet: string; siren: string }) {
        return {
            name: dto.nom_complet,
            siren: new Siren(dto.siren),
            mainEstablishmentSiret: dto.siege?.siret ? new Siret(dto.siege?.siret) : undefined,
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
        };
    }
}
