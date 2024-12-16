import { DefaultObject } from "../../../../@types";

export const TIER_DTO = {
    Code: "Code",
    RaisonSociale: "RaisonSociale",
    EstAssociation: "EstAssociation",
    EstCoFinanceurPostes: "EstCoFinanceurPostes",
    EstFinanceurPostes: "EstFinanceurPostes",
    SiretOuRidet: "SiretOuRidet",
    CodePostal: "CodePostal",
    Ville: "Ville",
    ContactEmail: "ContactEmail",
};

export const TIER_DTO_WITH_NULLS = { ...TIER_DTO, Ville: null };

export const POSTE_DTO = {
    Code: "Code",
    DispositifId: 1,
    PstStatutPosteLibelle: "PstStatutPosteLibelle",
    PstRaisonStatutLibelle: "PstRaisonStatutLibelle",
    FinanceurPrincipalCode: "FinanceurPrincipalCode",
    FinanceurAttributeurCode: "FinanceurAttributeurCode",
    AssociationBeneficiaireCode: "AssociationBeneficiaireCode",
    AssociationImplantationCode: "AssociationImplantationCode",
    Annee: 2022,
    MontantSubvention: 1000,
    DateFinTriennalite: 44926,
    PstTypePosteCode: "PstTypePosteCode",
    PleinTemps: "Oui",
    DoublementUniteCompte: "Non",
};

export const POSTE_DTO_WITH_NULLS = { ...POSTE_DTO, AssociationBeneficiaireCode: null };

export const VERSEMENT_DTO = {
    PosteCode: "Code",
    PeriodeDebut: 44896,
    PeriodeFin: 44835,
    DateVersement: 44926,
    MontantAPayer: 1000,
    MontantPaye: 1000,
};

export const TYPE_POSTE_DTO = {
    Code: "Code",
    Libelle: "Libelle",
};

export const TYPE_POSTE_DTO_WITH_NULLS = { ...TYPE_POSTE_DTO, Libelle: null };

export const DISPOSITIF_DTO = {
    Id: 1,
    Libelle: "Libelle",
    FinanceurCode: "FinanceurCode",
};

export const DISPOSITIF_DTO_WITH_NULLS = { ...DISPOSITIF_DTO, FinanceurCode: null };

export const VERSEMENT_DTO_WITH_NULLS = { ...VERSEMENT_DTO, MontantAPayer: null };

export const TIER_DTOS = [TIER_DTO, TIER_DTO_WITH_NULLS];

export const POSTE_DTOS = [POSTE_DTO, POSTE_DTO_WITH_NULLS];

export const VERSEMENT_DTOS = [VERSEMENT_DTO, VERSEMENT_DTO_WITH_NULLS];

export const TYPE_POSTE_DTOS = [TYPE_POSTE_DTO, TYPE_POSTE_DTO_WITH_NULLS];

export const DISPOSITIF_DTOS = [DISPOSITIF_DTO, DISPOSITIF_DTO_WITH_NULLS];
