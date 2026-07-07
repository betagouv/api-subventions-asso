import Siren from "../identifier-objects/Siren";
import Siret from "../identifier-objects/Siret";

export type SireneEtablissementEntity = {
    siren: Siren;
    nic: string;
    siret: Siret;
    etablissementSiege: boolean | null;
    numeroVoieEtablissement: string | null;
    typeVoieEtablissement: string | null;
    libelleVoieEtablissement: string | null;
    codePostalEtablissement: string | null;
    libelleCommuneEtablissement: string | null;
    codeCommuneEtablissement: string | null;
    codePaysEtrangerEtablissement: string | null;
    libellePaysEtrangerEtablissement: string | null;
};
