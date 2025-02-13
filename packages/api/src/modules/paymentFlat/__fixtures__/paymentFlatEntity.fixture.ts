import { Payment } from "dto";
import DEFAULT_ASSOCIATION from "../../../../tests/__fixtures__/association.fixture";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import Siren from "../../../valueObjects/Siren";
import Siret from "../../../valueObjects/Siret";

export const PAYMENT_FLAT_ENTITY = new PaymentFlatEntity(
    2023, // exerciceBudgetaire
    "siret", // typeIdEtablissementBeneficiaire
    new Siret(DEFAULT_ASSOCIATION.siret), // siret
    "siren", // typeIdEntrepriseBeneficiaire
    new Siren(DEFAULT_ASSOCIATION.siren), // siren
    89988.3, // operation amount
    new Date("2023-07-12T00:00:00.000Z"), // operation date
    "AA01/0776-C001-4000", // centre financier code
    "UO DGER XXXX-C001", // centre financier libelle
    "BRET", // attachement comptable
    "0001821732", // EJ
    "chorus", // provider
    "Programme Exemple", // program
    101, // program number
    "Mission Exemple", // mission
    "Ministère Exemple", // ministry
    "ME", // ministry acronym
    "0101-01-02", // action code
    "Label d'action Exemple", // action label
    "077601003222", // activity code
    "Label d'activité Exemple", // activity label
);

export const PAYMENT_FLAT_ENTITY_WITH_NULLS = new PaymentFlatEntity(
    2023, // exerciceBudgetaire
    "siret", // typeIdEtablissementBeneficiaire
    new Siret(DEFAULT_ASSOCIATION.siret), // siret
    "siren", // typeIdEntrepriseBeneficiaire
    new Siren(DEFAULT_ASSOCIATION.siren), // siren
    1000, // operation amount
    new Date("2025-02-12T00:00:00.000Z"), // operation date
    "AA01/0776-C001-4000", // centre financier code
    "UO DGER XXXX-C001", // centre financier libelle
    "BRET", // attachement comptable
    "0001821732", // EJ
    "chorus", // provider
    null, // program
    1, // program number
    "Mission Exemple", // mission
    "Ministère Exemple", // ministry
    null, // ministry acronym
    "0101-01-02", // action code
    "Label d'action Exemple", // action label
    "077601003222", // activity code
    "Label d'activité Exemple", // activity label
);

export const LIST_PAYMENT_FLAT_ENTITY = [PAYMENT_FLAT_ENTITY, PAYMENT_FLAT_ENTITY_WITH_NULLS];

const buildProviderValue = value => ({
    value,
    provider: "payment_flat",
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
