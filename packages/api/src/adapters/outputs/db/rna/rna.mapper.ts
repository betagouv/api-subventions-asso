import { RnaEntity } from "../../../../entities/RnaEntity";
import { Rna, Siret } from "../../../../identifier-objects";
import RnaDbo from "./rna.dbo";

export function toEntity(dbo: RnaDbo): RnaEntity {
    return {
        id: new Rna(dbo.id),
        creationDate: dbo["date-creat"],
        publicationDate: dbo["date-publi"],
        dissolutionDate: dbo["date-disso"],
        nature: dbo.nature,
        lastUpdateDate: dbo["maj-time"],
        siret: dbo.siret ? new Siret(dbo.siret) : null,
        rup: dbo["rup-mi"],
        name: dbo.titre,
        shortName: dbo["titre-court"],
        object: dbo.objet,
        socialObject: dbo["objet-social1"],
        address: {
            number: dbo["adrs-numvoie"],
            type: dbo["adrs-typevoie"],
            name: dbo["adrs-libvoie"],
            complement: dbo["adrs-complement"],
            postalCode: dbo["adrs-codepostal"],
            city: dbo["adrs-libcommune"],
        },
    };
}
