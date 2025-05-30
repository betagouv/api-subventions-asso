import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import FonjepDispositifEntity from "../entities/FonjepDispositifEntity";
import FonjepPosteEntity from "../entities/FonjepPosteEntity";
import FonjepTiersEntity from "../entities/FonjepTiersEntity";
import FonjepTypePosteEntity from "../entities/FonjepTypePosteEntity";
import FonjepVersementEntity, { PayedFonjepVersementEntity } from "../entities/FonjepVersementEntity";

export const TIERS_ENTITY: FonjepTiersEntity = {
    code: "CodeAsso",
    raisonSociale: "Raison Sociale",
    estAssociation: "Oui",
    estCoFinanceurPostes: "Non",
    estFinanceurPostes: "Oui",
    siretOuRidet: DEFAULT_ASSOCIATION.siret,
    codePostal: "35700",
    ville: "Rennes",
    contactEmail: "john.doe@ille-et-vilaine.fr",
};

export const TIERS_ENTITY_WITH_NULLS: FonjepTiersEntity = {
    code: "CodeAsso2",
    siretOuRidet: null,
    raisonSociale: "Raison Sociale",
    estAssociation: "Oui",
    estCoFinanceurPostes: "Non",
    estFinanceurPostes: "Oui",
    codePostal: "35700",
    ville: "Rennes",
    contactEmail: "john.doe@ille-et-vilaine.fr",
};

export const POSTE_ENTITY: FonjepPosteEntity = {
    code: "AB5400K",
    dispositifId: 1,
    financeurPrincipalCode: "FinanceurPrincipalCode",
    financeurAttributeurCode: "FinanceurAttributeurCode",
    associationBeneficiaireCode: TIERS_ENTITY.code,
    pstStatutPosteLibelle: "PstStatutPosteLibelle",
    pstRaisonStatutLibelle: "PstRaisonStatutLibelle",
    associationImplantationCode: "AssociationImplantationCode",
    annee: 2022,
    montantSubvention: 1000,
    dateFinTriennalite: new Date("2023-12-31"),
    pstTypePosteCode: "PstTypePosteCode",
    pleinTemps: "Oui",
    doublementUniteCompte: "Non",
};

// use to test payment with financeurPrincipalCode 10006 exclusion in PaymentFlat creation process. Link to #3431
export const POSTE_10006_ENTITY: FonjepPosteEntity = {
    code: "FJ10006",
    dispositifId: 1,
    financeurPrincipalCode: "10006",
    financeurAttributeurCode: "FinanceurAttributeurCode",
    associationBeneficiaireCode: TIERS_ENTITY.code,
    pstStatutPosteLibelle: "PstStatutPosteLibelle",
    pstRaisonStatutLibelle: "PstRaisonStatutLibelle",
    associationImplantationCode: "AssociationImplantationCode",
    annee: 2022,
    montantSubvention: 1000,
    dateFinTriennalite: new Date("2023-12-31"),
    pstTypePosteCode: "PstTypePosteCode",
    pleinTemps: "Oui",
    doublementUniteCompte: "Non",
};

export const POSTE_WITHOUT_ASSOCIATION = {
    code: "NA00004",
    dispositifId: 1,
    financeurPrincipalCode: "10006",
    financeurAttributeurCode: "FinanceurAttributeurCode",
    associationBeneficiaireCode: "NO_ASSOCIATION_CODE",
    pstStatutPosteLibelle: "PstStatutPosteLibelle",
    pstRaisonStatutLibelle: "PstRaisonStatutLibelle",
    associationImplantationCode: "AssociationImplantationCode",
    annee: 2022,
    montantSubvention: 1000,
    dateFinTriennalite: new Date("2023-12-31"),
    pstTypePosteCode: "PstTypePosteCode",
    pleinTemps: "Oui",
    doublementUniteCompte: "Non",
};

export const POSTE_ENTITY_WITH_NULLS: FonjepPosteEntity = {
    code: "ZZ9980J",
    dispositifId: null,
    financeurPrincipalCode: "FinanceurPrincipalCode",
    financeurAttributeurCode: "FinanceurAttributeurCode",
    associationBeneficiaireCode: TIERS_ENTITY_WITH_NULLS.code,
    pstStatutPosteLibelle: "PstStatutPosteLibelle",
    pstRaisonStatutLibelle: "PstRaisonStatutLibelle",
    associationImplantationCode: "AssociationImplantationCode",
    annee: 2022,
    montantSubvention: 1000,
    dateFinTriennalite: new Date("2023-12-31"),
    pstTypePosteCode: "PstTypePosteCode",
    pleinTemps: "Oui",
    doublementUniteCompte: "Non",
};

export const VERSEMENT_ENTITY: PayedFonjepVersementEntity = {
    posteCode: POSTE_ENTITY.code,
    periodeDebut: new Date("2022-01-12"),
    periodeFin: new Date("2022-12-14"),
    dateVersement: new Date("2022-04-15"),
    montantAPayer: 1000,
    montantPaye: 1000,
};

export const VERSEMENT_10006_ENTITY: PayedFonjepVersementEntity = {
    posteCode: POSTE_10006_ENTITY.code,
    periodeDebut: new Date("2022-04-12"),
    periodeFin: new Date("2022-12-14"),
    dateVersement: new Date("2022-05-15"),
    montantAPayer: 3000,
    montantPaye: 3000,
};

export const VERSEMENT_WITHOUT_POSITION = {
    posteCode: "NO_POSITION_CODE",
    periodeDebut: new Date("2022-04-12"),
    periodeFin: new Date("2022-12-14"),
    dateVersement: new Date("2022-05-15"),
    montantAPayer: 3000,
    montantPaye: 3000,
};

export const VERSEMENT_WITHOUT_ASSOCIATION = {
    posteCode: POSTE_WITHOUT_ASSOCIATION.code,
    periodeDebut: new Date("2022-04-12"),
    periodeFin: new Date("2022-12-14"),
    dateVersement: new Date("2022-05-15"),
    montantAPayer: 3000,
    montantPaye: 3000,
};

export const VERSEMENT_ENTITY_WITH_NULLS: FonjepVersementEntity = {
    posteCode: POSTE_ENTITY_WITH_NULLS.code,
    periodeDebut: null,
    periodeFin: null,
    dateVersement: null,
    montantAPayer: 1000,
    montantPaye: null,
};

export const TYPE_POSTE_ENTITY: FonjepTypePosteEntity = { code: "Code", libelle: "Libelle" };

export const DISPOSITIF_ENTITY: FonjepDispositifEntity = { id: 1, libelle: "Libelle", financeurCode: "FinanceurCode" };

export const TIERS_ENTITIES = [TIERS_ENTITY, TIERS_ENTITY_WITH_NULLS];

export const POSTE_ENTITIES = [POSTE_ENTITY, POSTE_ENTITY_WITH_NULLS];

export const VERSEMENT_ENTITIES = [VERSEMENT_ENTITY, VERSEMENT_ENTITY_WITH_NULLS];

export const TYPE_POSTE_ENTITIES = [TYPE_POSTE_ENTITY];

export const DISPOSITIF_ENTITIES = [DISPOSITIF_ENTITY];
