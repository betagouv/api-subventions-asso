import FonjepDispositifDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepDispositifDto";
import FonjepPosteDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepPosteDto";
import FonjepTiersDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepTiersDto";
import FonjepTypePosteDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepTypePosteDto";
import FonjepVersementDtoWithExcelDate from "../../../../dataProviders/db/providers/fonjep/dto/fonjepVersementDto";

export const TIER_DTO: FonjepTiersDto = {
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

export const TIER_DTO_WITH_NULL: FonjepTiersDto = {
    Code: "Code",
    RaisonSociale: null,
    EstAssociation: null,
    EstCoFinanceurPostes: null,
    EstFinanceurPostes: null,
    SiretOuRidet: null,
    CodePostal: null,
    Ville: null,
    ContactEmail: null,
};

export const POSTE_DTO: FonjepPosteDto = {
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

export const POSTE_DTO_WITH_DATE = {
    ...POSTE_DTO,
    DateFinTriennalite: new Date("2023-12-31"),
};

export const POSTE_DTO_WITH_NULL: FonjepPosteDto = { ...POSTE_DTO, DispositifId: null };

export const VERSEMENT_DTO: FonjepVersementDtoWithExcelDate = {
    PosteCode: "Code",
    PeriodeDebut: 44896,
    PeriodeFin: 44835,
    DateVersement: 44926,
    MontantAPayer: 1000,
    MontantPaye: 1000,
};

export const VERSEMENT_DTO_WITH_DATE = {
    ...VERSEMENT_DTO,
    PeriodeDebut: new Date("2022-01-12"),
    PeriodeFin: new Date("2022-12-14"),
    DateVersement: new Date("2022-04-15"),
};

export const VERSEMENT_DTO_WITH_NULL: FonjepVersementDtoWithExcelDate = {
    PosteCode: "Code",
    PeriodeDebut: 46896,
    PeriodeFin: 46835,
    DateVersement: null,
    MontantAPayer: null,
    MontantPaye: null,
};

export const TYPE_POSTE_DTO: FonjepTypePosteDto = {
    Code: "Code",
    Libelle: "Libelle",
};

export const DISPOSITIF_DTO: FonjepDispositifDto = {
    ID: 1,
    Libelle: "Libelle",
    FinanceurCode: "FinanceurCode",
};

export const TIER_DTOS = [TIER_DTO, TIER_DTO_WITH_NULL];

export const POSTE_DTOS = [POSTE_DTO, POSTE_DTO_WITH_NULL];
export const POSTE_DTOS_WITH_DATE = [POSTE_DTO, POSTE_DTO_WITH_DATE];

export const VERSEMENT_DTOS = [VERSEMENT_DTO, VERSEMENT_DTO_WITH_NULL];
export const VERSEMENT_DTOS_WITH_DATE = [VERSEMENT_DTO, VERSEMENT_DTO_WITH_DATE];

export const TYPE_POSTE_DTOS = [TYPE_POSTE_DTO];

export const DISPOSITIF_DTOS = [DISPOSITIF_DTO];
