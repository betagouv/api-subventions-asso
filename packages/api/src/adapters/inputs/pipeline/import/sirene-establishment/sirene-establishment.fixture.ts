import SireneEstablishmentDto from "./sirene-establishment.dto";

export const SIRENE_ESTABLISHMENT_DTO: SireneEstablishmentDto = {
    siren: "123456789",
    nic: "00012",
    siret: "12345678900012",
    dateDernierTraitementEtablissement: new Date("2026-07-08T12:00:00"),
    etablissementSiege: true,
    numeroVoieEtablissement: "1",
    typeVoieEtablissement: "RUE",
    libelleVoieEtablissement: "DE LA PAIX",
    codePostalEtablissement: "75001",
    libelleCommuneEtablissement: "PARIS",
    codeCommuneEtablissement: "75101",
    codePaysEtrangerEtablissement: "",
    libellePaysEtrangerEtablissement: "",
};

export const SIRENE_ESTABLISHMENT_DTO_OLDER: SireneEstablishmentDto = {
    ...SIRENE_ESTABLISHMENT_DTO,
    dateDernierTraitementEtablissement: new Date("2026-07-07T12:00:00"),
};

export const SIRENE_ESTABLISHMENT_DTO_NEWER: SireneEstablishmentDto = {
    ...SIRENE_ESTABLISHMENT_DTO,
    dateDernierTraitementEtablissement: new Date("2026-07-09T12:00:00"),
};
