import { Payment } from "dto";
import DEFAULT_ASSOCIATION from "../../../../tests/__fixtures__/association.fixture";
import Siren from "../../../identifierObjects/Siren";
import Siret from "../../../identifierObjects/Siret";
import { ChorusPaymentFlatEntity } from "../../providers/chorus/@types/ChorusPaymentFlat";
import { GenericAdapter } from "../../../shared/GenericAdapter";
import PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";
import { FonjepPaymentFlatEntity } from "../../providers/fonjep/entities/FonjepFlatEntity";

export const CHORUS_PAYMENT_ID = "1000000000019--subv001--2023";

export const CHORUS_PAYMENT_FLAT_ENTITY: ChorusPaymentFlatEntity = {
    uniqueId: "UNIQUE_ID",
    idVersement: CHORUS_PAYMENT_ID, // id versement
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
    updateDate: new Date("2025-02-04"), // update date
};

export const LONELY_CHORUS_PAYMENT = { ...CHORUS_PAYMENT_FLAT_ENTITY, idVersement: "lonely-payment" };

export const CHORUS_PAYMENT_FLAT_ENTITY_WITH_NULLS: ChorusPaymentFlatEntity = {
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
    updateDate: new Date("2025-02-04"), // update date
};

export const FONJEP_PAYMENT_FLAT_ID_VERSEMENT = `S03351-2023-05-12-2023-${new Siret(DEFAULT_ASSOCIATION.siret)}`;

export const FONJEP_PAYMENT_FLAT_ENTITY: FonjepPaymentFlatEntity = {
    idVersement: FONJEP_PAYMENT_FLAT_ID_VERSEMENT,
    uniqueId: `${FONJEP_PAYMENT_FLAT_ID_VERSEMENT}-163-2023-07-12`,
    exerciceBudgetaire: 2023,
    typeIdEtablissementBeneficiaire: "siret",
    idEtablissementBeneficiaire: new Siret(DEFAULT_ASSOCIATION.siret),
    typeIdEntrepriseBeneficiaire: "siren",
    idEntrepriseBeneficiaire: new Siren(DEFAULT_ASSOCIATION.siren),
    amount: 3752,
    operationDate: new Date("2023-07-12T00:00:00.000Z"),
    ej: GenericAdapter.NOT_APPLICABLE_VALUE,
    centreFinancierCode: GenericAdapter.NOT_APPLICABLE_VALUE,
    centreFinancierLibelle: GenericAdapter.NOT_APPLICABLE_VALUE,
    attachementComptable: GenericAdapter.NOT_APPLICABLE_VALUE,
    regionAttachementComptable: GenericAdapter.NOT_APPLICABLE_VALUE,
    programName: "Programme Exemple",
    programNumber: 163,
    mission: "Mission Exemple",
    ministry: "Ministère Exemple",
    ministryAcronym: "ME",
    actionCode: null,
    actionLabel: "Développement de la vie associative",
    activityCode: null,
    activityLabel: "Label d'activité Exemple",
    provider: "fonjep",
    updateDate: new Date("2025-02-04"), // update date
};

export const FONJEP_PAYMENT_FLAT_ENTITY_2: FonjepPaymentFlatEntity = {
    idVersement: FONJEP_PAYMENT_FLAT_ID_VERSEMENT,
    uniqueId: `${FONJEP_PAYMENT_FLAT_ID_VERSEMENT}-163-2023-11-12`,
    exerciceBudgetaire: 2023,
    typeIdEtablissementBeneficiaire: "siret",
    idEtablissementBeneficiaire: new Siret(DEFAULT_ASSOCIATION.siret),
    typeIdEntrepriseBeneficiaire: "siren",
    idEntrepriseBeneficiaire: new Siren(DEFAULT_ASSOCIATION.siren),
    amount: 3752,
    operationDate: new Date("2023-11-12T00:00:00.000Z"),
    ej: GenericAdapter.NOT_APPLICABLE_VALUE,
    centreFinancierCode: GenericAdapter.NOT_APPLICABLE_VALUE,
    centreFinancierLibelle: GenericAdapter.NOT_APPLICABLE_VALUE,
    attachementComptable: GenericAdapter.NOT_APPLICABLE_VALUE,
    regionAttachementComptable: GenericAdapter.NOT_APPLICABLE_VALUE,
    programName: "Programme Exemple",
    programNumber: 163,
    mission: "Mission Exemple",
    ministry: "Ministère Exemple",
    ministryAcronym: "ME",
    actionCode: null,
    actionLabel: "Développement de la vie associative",
    activityCode: null,
    activityLabel: "Label d'activité Exemple",
    provider: "fonjep",
    updateDate: new Date("2025-02-04"), // update date
};

export const LIST_PAYMENT_FLAT_ENTITY: PaymentFlatEntity[] = [
    CHORUS_PAYMENT_FLAT_ENTITY,
    CHORUS_PAYMENT_FLAT_ENTITY_WITH_NULLS,
    FONJEP_PAYMENT_FLAT_ENTITY,
];

const buildProviderValue = value => ({
    value,
    provider: CHORUS_PAYMENT_FLAT_ENTITY.provider,
    type: typeof value,
    last_update: new Date("2025-02-04"),
});

export const PAYMENT_FROM_PAYMENT_FLAT: Payment = {
    exerciceBudgetaire: buildProviderValue(CHORUS_PAYMENT_FLAT_ENTITY.exerciceBudgetaire),
    ej: buildProviderValue(CHORUS_PAYMENT_FLAT_ENTITY.ej),
    versementKey: buildProviderValue(CHORUS_PAYMENT_FLAT_ENTITY.ej),
    siret: buildProviderValue(CHORUS_PAYMENT_FLAT_ENTITY.idEtablissementBeneficiaire),
    amount: buildProviderValue(CHORUS_PAYMENT_FLAT_ENTITY.amount),
    dateOperation: buildProviderValue(CHORUS_PAYMENT_FLAT_ENTITY.operationDate),
    programme: buildProviderValue(CHORUS_PAYMENT_FLAT_ENTITY.programNumber),
    libelleProgramme: buildProviderValue(CHORUS_PAYMENT_FLAT_ENTITY.programName),
    centreFinancier: buildProviderValue(CHORUS_PAYMENT_FLAT_ENTITY.centreFinancierLibelle),
    domaineFonctionnel: buildProviderValue(CHORUS_PAYMENT_FLAT_ENTITY.actionLabel),
    activitee: buildProviderValue(CHORUS_PAYMENT_FLAT_ENTITY.activityLabel),
};
