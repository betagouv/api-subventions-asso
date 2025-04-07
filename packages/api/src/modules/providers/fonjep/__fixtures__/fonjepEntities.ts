import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import FonjepDispositifEntity from "../entities/FonjepDispositifEntity";
import FonjepPosteEntity from "../entities/FonjepPosteEntity";
import FonjepTiersEntity from "../entities/FonjepTiersEntity";
import FonjepTypePosteEntity from "../entities/FonjepTypePosteEntity";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";

export const TIER_ENTITY: FonjepTiersEntity = {
    code: "Code",
    raisonSociale: "Raison Sociale",
    estAssociation: "Oui",
    estCoFinanceurPostes: "Non",
    estFinanceurPostes: "Oui",
    siretOuRidet: DEFAULT_ASSOCIATION.siret,
    codePostal: "35700",
    ville: "Rennes",
    contactEmail: "john.doe@ille-et-vilaine.fr",
};

export const TIER_ENTITY_WITH_NULLS: FonjepTiersEntity = {
    code: "Code",
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
    code: "Code",
    dispositifId: 1,
    financeurPrincipalCode: "FinanceurPrincipalCode",
    financeurAttributeurCode: "FinanceurAttributeurCode",
    associationBeneficiaireCode: "AssociationBeneficiaireCode",
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
    code: "Code",
    dispositifId: null,
    financeurPrincipalCode: "FinanceurPrincipalCode",
    financeurAttributeurCode: "FinanceurAttributeurCode",
    associationBeneficiaireCode: "AssociationBeneficiaireCode",
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

export const VERSEMENT_ENTITY: FonjepVersementEntity = {
    posteCode: "Code",
    periodeDebut: new Date("2022-01-12"),
    periodeFin: new Date("2022-12-14"),
    dateVersement: new Date("2022-04-15"),
    montantAPayer: 1000,
    montantPaye: 1000,
};

export const VERSEMENT_ENTITY_WITH_NULLS: FonjepVersementEntity = {
    posteCode: "Code",
    periodeDebut: null,
    periodeFin: null,
    dateVersement: null,
    montantAPayer: 1000,
    montantPaye: null,
};

export const TYPE_POSTE_ENTITY: FonjepTypePosteEntity = { code: "Code", libelle: "Libelle" };

export const DISPOSITIF_ENTITY: FonjepDispositifEntity = { id: 1, libelle: "Libelle", financeurCode: "FinanceurCode" };

export const TIER_ENTITIES = [TIER_ENTITY, TIER_ENTITY_WITH_NULLS];

export const POSTE_ENTITIES = [POSTE_ENTITY, POSTE_ENTITY_WITH_NULLS];

export const VERSEMENT_ENTITIES = [VERSEMENT_ENTITY, VERSEMENT_ENTITY_WITH_NULLS];

export const TYPE_POSTE_ENTITIES = [TYPE_POSTE_ENTITY];

export const DISPOSITIF_ENTITIES = [DISPOSITIF_ENTITY];
