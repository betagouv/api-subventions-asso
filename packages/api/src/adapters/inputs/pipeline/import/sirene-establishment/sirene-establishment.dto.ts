export interface SireneStockEtablissementDto {
    siren: string;
    nic: string;
    siret: string;
    statutDiffusionEtablissement: string | null;
    dateCreationEtablissement: Date | null;
    trancheEffectifsEtablissement: string | null;
    anneeEffectifsEtablissement: bigint | null;
    activitePrincipaleRegistreMetiersEtablissement: string | null;
    dateDernierTraitementEtablissement: Date;
    etablissementSiege: boolean;
    nombrePeriodesEtablissement: bigint | null;
    complementAdresseEtablissement: string | null;
    numeroVoieEtablissement: string | null;
    indiceRepetitionEtablissement: string | null;
    dernierNumeroVoieEtablissement: string | null;
    indiceRepetitionDernierNumeroVoieEtablissement: string | null;
    typeVoieEtablissement: string | null;
    libelleVoieEtablissement: string | null;
    codePostalEtablissement: string | null;
    libelleCommuneEtablissement: string | null;
    libelleCommuneEtrangerEtablissement: string | null;
    distributionSpecialeEtablissement: string | null;
    codeCommuneEtablissement: string | null;
    codeCedexEtablissement: string | null;
    libelleCedexEtablissement: string | null;
    codePaysEtrangerEtablissement: string | null;
    libellePaysEtrangerEtablissement: string | null;
    identifiantAdresseEtablissement: string | null;
    coordonneeLambertAbscisseEtablissement: string | null;
    coordonneeLambertOrdonneeEtablissement: string | null;
    complementAdresse2Etablissement: string | null;
    numeroVoie2Etablissement: string | null;
    indiceRepetition2Etablissement: string | null;
    typeVoie2Etablissement: string | null;
    libelleVoie2Etablissement: string | null;
    codePostal2Etablissement: string | null;
    libelleCommune2Etablissement: string | null;
    libelleCommuneEtranger2Etablissement: string | null;
    distributionSpeciale2Etablissement: string | null;
    codeCommune2Etablissement: string | null;
    codeCedex2Etablissement: string | null;
    libelleCedex2Etablissement: string | null;
    codePaysEtranger2Etablissement: string | null;
    libellePaysEtranger2Etablissement: string | null;
    dateDebut: Date | null;
    etatAdministratifEtablissement: string | null;
    enseigne1Etablissement: string | null;
    enseigne2Etablissement: string | null;
    enseigne3Etablissement: string | null;
    denominationUsuelleEtablissement: string | null;
    activitePrincipaleEtablissement: string | null;
    nomenclatureActivitePrincipaleEtablissement: string | null;
    caractereEmployeurEtablissement: string | null;
    activitePrincipaleNAF25Etablissement: string | null;
}

export const SIRENE_ESTABLISHMENT_DTO_FIELDS = [
    "siren",
    "nic",
    "siret",
    "dateDernierTraitementEtablissement",
    "etablissementSiege",
    "numeroVoieEtablissement",
    "typeVoieEtablissement",
    "libelleVoieEtablissement",
    "codePostalEtablissement",
    "libelleCommuneEtablissement",
    "codeCommuneEtablissement",
    "codePaysEtrangerEtablissement",
    "libellePaysEtrangerEtablissement",
] satisfies (keyof SireneStockEtablissementDto)[];

type SireneEstablishmentDto = Omit<
    Pick<SireneStockEtablissementDto, (typeof SIRENE_ESTABLISHMENT_DTO_FIELDS)[number]>,
    "dateDernierTraitementEtablissement"
> & {
    dateDernierTraitementEtablissement: Date;
};

export default SireneEstablishmentDto;
