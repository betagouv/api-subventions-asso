import { RechercheAssociationDto } from "dto";
import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";

export function toDto(entity: AssociationSearchEntity): RechercheAssociationDto {
    return {
        ...entity,
        siren: entity.siren.value,
        rna: entity.rna?.value ?? null,
        name: entity.name,
        adresse: {
            numero: entity.address?.number ?? null,
            type_voie: entity.address?.type ?? null,
            voie: entity.address?.name ?? null,
            code_postal: entity.address?.postalCode ?? null,
            commune: entity.address?.city ?? null,
        },
        nbEtabs: entity.nbEstabs ?? null,
    };
}
