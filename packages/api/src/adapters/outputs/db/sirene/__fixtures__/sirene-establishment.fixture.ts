import DEFAULT_ASSOCIATION from "../../../../../../tests/__fixtures__/association.fixture";
import { SireneEstablishmentDbo } from "../sirene-establishment.dbo";

export const ESTABLISHMENT_DBO: SireneEstablishmentDbo = {
    siret: DEFAULT_ASSOCIATION.siret,
    codeCommuneEtablissement: "44184",
    codePaysEtrangerEtablissement: null,
    codePostalEtablissement: "44600",
    dateDernierTraitementEtablissement: new Date("2025-12-05"),
    etablissementSiege: true,
    libelleCommuneEtablissement: "SAINT-NAZAIRE",
    libellePaysEtrangerEtablissement: null,
    libelleVoieEtablissement: "VIVANT LACOUR",
    nic: "00011",
    numeroVoieEtablissement: "69",
    siren: DEFAULT_ASSOCIATION.siren,
    typeVoieEtablissement: "RUE",
};
