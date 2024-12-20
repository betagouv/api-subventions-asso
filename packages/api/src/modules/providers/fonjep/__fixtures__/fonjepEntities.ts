import FonjepDispositifEntity from "../entities/FonjepDispositifEntity";
import FonjepPosteEntity from "../entities/FonjepPosteEntity";
import FonjepTiersEntity from "../entities/FonjepTiersEntity";
import FonjepTypePosteEntity from "../entities/FonjepTypePosteEntity";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";

export const TIER_ENTITY = new FonjepTiersEntity(
    "Code",
    "RaisonSociale",
    "EstAssociation",
    "EstCoFinanceurPostes",
    "EstFinanceurPostes",
    "SiretOuRidet",
    "CodePostal",
    "Ville",
    "ContactEmail",
);

export const TIER_ENTITY_WITH_NULLS = new FonjepTiersEntity(
    "Code",
    "RaisonSociale",
    "EstAssociation",
    "EstCoFinanceurPostes",
    "EstFinanceurPostes",
    "SiretOuRidet",
    "CodePostal",
    null,
    "ContactEmail",
);

export const POSTE_ENTITY = new FonjepPosteEntity(
    "Code",
    1,
    "PstStatutPosteLibelle",
    "PstRaisonStatutLibelle",
    "FinanceurPrincipalCode",
    "FinanceurAttributeurCode",
    "AssociationBeneficiaireCode",
    "AssociationImplantationCode",
    2022,
    1000,
    44926,
    "PstTypePosteCode",
    "Oui",
    "Non",
);

export const POSTE_ENTITY_WITH_NULLS = new FonjepPosteEntity(
    "Code",
    1,
    "PstStatutPosteLibelle",
    "PstRaisonStatutLibelle",
    "FinanceurPrincipalCode",
    "FinanceurAttributeurCode",
    null,
    "AssociationImplantationCode",
    2022,
    1000,
    44926,
    "PstTypePosteCode",
    "Oui",
    "Non",
);

export const VERSEMENT_ENTITY = new FonjepVersementEntity("Code", 44896, 44835, 44926, 1000, 1000);

export const VERSEMENT_ENTITY_WITH_NULLS = new FonjepVersementEntity("Code", 44896, 44835, 44926, null, 1000);

export const TYPE_POSTE_ENTITY = new FonjepTypePosteEntity("Code", "Libelle");

export const TYPE_POSTE_ENTITY_WITH_NULLS = new FonjepTypePosteEntity("Code", null);

export const DISPOSITIF_ENTITY = new FonjepDispositifEntity(1, "Libelle", "FinanceurCode");

export const DISPOSITIF_ENTITY_WITH_NULLS = new FonjepDispositifEntity(1, "Libelle", null);

export const TIER_ENTITIES = [TIER_ENTITY, TIER_ENTITY_WITH_NULLS];

export const POSTE_ENTITIES = [POSTE_ENTITY, POSTE_ENTITY_WITH_NULLS];

export const VERSEMENT_ENTITIES = [VERSEMENT_ENTITY, VERSEMENT_ENTITY_WITH_NULLS];

export const TYPE_POSTE_ENTITIES = [TYPE_POSTE_ENTITY, TYPE_POSTE_ENTITY_WITH_NULLS];

export const DISPOSITIF_ENTITIES = [DISPOSITIF_ENTITY, DISPOSITIF_ENTITY_WITH_NULLS];
