export type StockEtabRow = {
    siren: string;
    nic: string;
    siret: string;
    statutDiffusionEtablissement: "O" | "P"; // TODO comprendre spécifier
    dateCreationEtablissement: string; // date | null
    trancheEffectifsEtablissement: string; // "NN" | null | number
    anneeEffectifsEtablissement: string; // number | null
    activitePrincipaleRegistreMetiersEtablissement: string;
    dateDernierTraitementEtablissement: string; // datetime | null
    etablissementSiege: "true" | "false";
    nombrePeriodesEtablissement: string; // number
    complementAdresseEtablissement: string;
    numeroVoieEtablissement: string; // number
    indiceRepetitionEtablissement: string;
    typeVoieEtablissement: string;
    libelleVoieEtablissement: string;
    codePostalEtablissement: string;
    libelleCommuneEtablissement: string;
    libelleCommuneEtrangerEtablissement: string;
    distributionSpecialeEtablissement: string;
    codeCommuneEtablissement: string;
    codeCedexEtablissement: string;
    libelleCedexEtablissement: string;
    codePaysEtrangerEtablissement: string;
    libellePaysEtrangerEtablissement: string;
    complementAdresse2Etablissement: string;
    numeroVoie2Etablissement: string;
    indiceRepetition2Etablissement: string;
    typeVoie2Etablissement: string;
    libelleVoie2Etablissement: string;
    codePostal2Etablissement: string;
    libelleCommune2Etablissement: string;
    libelleCommuneEtranger2Etablissement: string;
    distributionSpeciale2Etablissement: string;
    codeCommune2Etablissement: string;
    codeCedex2Etablissement: string;
    libelleCedex2Etablissement: string;
    codePaysEtranger2Etablissement: string;
    libellePaysEtranger2Etablissement: string;
    dateDebut: string;
    etatAdministratifEtablissement: "A" | "F" | null; // actif ou fermé
    enseigne1Etablissement: string;
    enseigne2Etablissement: string;
    enseigne3Etablissement: string;
    denominationUsuelleEtablissement: string;
    activitePrincipaleEtablissement: string;
    nomenclatureActivitePrincipaleEtablissement: string;
    caractereEmployeurEtablissement: "O" | "N";
};
