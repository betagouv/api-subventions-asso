import { Payment } from "dto";
import DEFAULT_ASSOCIATION from "../../../../tests/__fixtures__/association.fixture";
import Siren from "../../../valueObjects/Siren";
import Siret from "../../../valueObjects/Siret";
import { ChorusPaymentFlatEntity } from "../../providers/chorus/@types/ChorusPaymentFlat";

export const PAYMENT_FLAT_ENTITY: ChorusPaymentFlatEntity = {
    uniqueId: "UNIQUE_ID",
    idVersement: "ID_VERSEMENT", // id versement
    exerciceBudgetaire: 2023, // exerciceBudgetaire
    typeIdEtablissementBeneficiaire: "siret", // typeIdEtablissementBeneficiaire
    idEtablissementBeneficiaire: new Siret(DEFAULT_ASSOCIATION.siret),
    typeIdEntrepriseBeneficiaire: "siren", // typeIdEntrepriseBeneficiaire
    idEntrepriseBeneficiaire: new Siren(DEFAULT_ASSOCIATION.siren),
    amount: 89988.3, // operation amount
    operationDate: new Date("2023-07-12T00:00:00.000Z"), // operation date
    centreFinancierCode: "AA01/0776-C001-4000", // centre financier code
    centreFinancierLibelle: "UO DGER XXXX-C001", // centre financier libelle
    attachementComptable: "BRET", // attachement comptable
    regionAttachementComptable: "Bretagne", // region attachement comptable
    ej: "0001821732", // EJ
    codePoste: null,
    provider: "chorus", // provider
    programName: "Programme Exemple", // program
    programNumber: 101, // program number
    mission: "Mission Exemple", // mission
    ministry: "Ministère Exemple", // ministry
    ministryAcronym: "ME", // ministry acronym
    actionCode: "0101-01-02", // action code
    actionLabel: "Label d'action Exemple", // action label
    activityCode: "077601003222", // activity code
    activityLabel: "Label d'activité Exemple", // activity label
};

export const PAYMENT_FLAT_ENTITY_WITH_NULLS: ChorusPaymentFlatEntity = {
    uniqueId: "UNIQUE_ID",
    idVersement: "ID_VERSEMENT", // id versement
    exerciceBudgetaire: 2023, // exerciceBudgetaire
    typeIdEtablissementBeneficiaire: "siret", // typeIdEtablissementBeneficiaire
    idEtablissementBeneficiaire: new Siret(DEFAULT_ASSOCIATION.siret),
    typeIdEntrepriseBeneficiaire: "siren", // typeIdEntrepriseBeneficiaire
    idEntrepriseBeneficiaire: new Siren(DEFAULT_ASSOCIATION.siren),
    amount: 89988.3, // operation amount
    operationDate: new Date("2023-07-12T00:00:00.000Z"), // operation date
    centreFinancierCode: "AA01/0776-C001-4000", // centre financier code
    centreFinancierLibelle: "UO DGER XXXX-C001", // centre financier libelle
    attachementComptable: "BRET", // attachement comptable
    regionAttachementComptable: "Bretagne", // region attachement comptable
    ej: "0001821732", // EJ
    codePoste: null,
    provider: "chorus", // provider
    programName: null, // program
    programNumber: 101, // program number
    mission: "Mission Exemple", // mission
    ministry: "Ministère Exemple", // ministry
    ministryAcronym: null, // ministry acronym
    actionCode: "0101-01-02", // action code
    actionLabel: "Label d'action Exemple", // action label
    activityCode: "077601003222", // activity code
    activityLabel: "Label d'activité Exemple", // activity label
};

export const LIST_PAYMENT_FLAT_ENTITY = [PAYMENT_FLAT_ENTITY, PAYMENT_FLAT_ENTITY_WITH_NULLS];

const buildProviderValue = value => ({
    value,
    provider: PAYMENT_FLAT_ENTITY.provider,
    type: typeof value,
    last_update: new Date("2025-02-04"),
});

export const PAYMENT_FROM_PAYMENT_FLAT: Payment = {
    ej: buildProviderValue(PAYMENT_FLAT_ENTITY.ej),
    versementKey: buildProviderValue(PAYMENT_FLAT_ENTITY.ej),
    siret: buildProviderValue(PAYMENT_FLAT_ENTITY.idEtablissementBeneficiaire),
    amount: buildProviderValue(PAYMENT_FLAT_ENTITY.amount),
    dateOperation: buildProviderValue(PAYMENT_FLAT_ENTITY.operationDate),
    programme: buildProviderValue(PAYMENT_FLAT_ENTITY.programNumber),
    libelleProgramme: buildProviderValue(PAYMENT_FLAT_ENTITY.programName),
    centreFinancier: buildProviderValue(PAYMENT_FLAT_ENTITY.centreFinancierLibelle),
    domaineFonctionnel: buildProviderValue(PAYMENT_FLAT_ENTITY.actionLabel),
    activitee: buildProviderValue(PAYMENT_FLAT_ENTITY.activityLabel),
};
