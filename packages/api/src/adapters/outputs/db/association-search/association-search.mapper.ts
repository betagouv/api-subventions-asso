import AssociationSearchEntity, { AssociationSearchPartialUpdate } from "../../../../entities/AssociationSearchEntity";
import Siren from "../../../../identifier-objects/Siren";
import AssociationSearchDbo from "./@types/AssociationSearchDbo";
import Rna from "../../../../identifier-objects/Rna";
import { Siret } from "../../../../identifier-objects";

export default class AssociationSearchMapper {
    static toEntity(dbo: AssociationSearchDbo): AssociationSearchEntity {
        return new AssociationSearchEntity({
            ...dbo,
            siren: new Siren(dbo.siren),
            mainEstablishmentSiret: new Siret(dbo.mainEstablishmentSiret),
            rna: dbo.rna ? new Rna(dbo.rna) : undefined,
            address: dbo.address ?? undefined,
            nbEstabs: dbo.nbEstabs ?? undefined,
        });
    }

    static toPartialDbo(entity: AssociationSearchPartialUpdate): Partial<AssociationSearchDbo> {
        const { siren, rna, mainEstablishmentSiret, ...rest } = entity;
        const dbo: Partial<AssociationSearchDbo> = { ...rest };
        if (siren) dbo.siren = siren.value;
        if (rna) dbo.rna = rna.value;
        if (mainEstablishmentSiret) dbo.mainEstablishmentSiret = mainEstablishmentSiret.value;
        return dbo;
    }
}
