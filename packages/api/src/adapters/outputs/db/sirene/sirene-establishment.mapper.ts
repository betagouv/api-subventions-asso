import { EstablishmentEntity } from "../../../../domain/structures/establishments/EstablishmentEntity";
import { SireneEstablishmentDbo } from "./sirene-establishment.dbo";

export const toEntity = (dbo: SireneEstablishmentDbo): EstablishmentEntity => {
    return new EstablishmentEntity({
        siret: dbo.siret,
        siege: dbo.etablissementSiege,
        address: {
            number: dbo.numeroVoieEtablissement,
            type: dbo.typeVoieEtablissement,
            name: dbo.libelleVoieEtablissement,
            complement: null,
            postalCode: dbo.codePostalEtablissement,
            city: dbo.libelleCommuneEtablissement,
        },
        lastUpdate: dbo.dateDernierTraitementEtablissement,
    });
};
