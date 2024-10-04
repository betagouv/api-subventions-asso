import AssociationNameEntity from "../../../modules/association-name/entities/AssociationNameEntity";
import Rna from "../../../valueObjects/Rna";
import Siren from "../../../valueObjects/Siren";
import { RechercheEntreprisesResultDto } from "./RechercheEntreprisesDto";

export class RechercheEntreprisesAdapter {
    static toAssociationNameEntity(dto: RechercheEntreprisesResultDto & { nom_complet: string; siren: string }) {
        return new AssociationNameEntity(
            dto.nom_complet,
            new Siren(dto.siren),
            dto.complements?.identifiant_association ? new Rna(dto.complements?.identifiant_association) : undefined,
            dto.siege
                ? {
                      numero: dto.siege.numero_voie,
                      type_voie: dto.siege.type_voie,
                      voie: dto.siege.libelle_voie,
                      code_postal: dto.siege.code_postal || undefined,
                      commune: dto.siege.libelle_commune || undefined,
                  }
                : undefined,
            dto.nombre_etablissements,
        );
    }
}
