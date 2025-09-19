import { ApplicationNature, ApplicationStatus, PaymentCondition } from "dto";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";
import { ApplicationFlatDbo } from "../../../dataProviders/db/applicationFlat/ApplicationFlatDbo";
import { ObjectId } from "mongodb";
import DEFAULT_ASSOCIATION from "../../../../tests/__fixtures__/association.fixture";
import { FONJEP_PAYMENT_FLAT_ID_VERSEMENT } from "../../paymentFlat/__fixtures__/paymentFlatEntity.fixture";
import Siret from "../../../identifierObjects/Siret";

export const PAYMENT_ID = "1000000000019--subv001--2025";

export const DRAFT_ENTITY: Omit<ApplicationFlatEntity, "uniqueId" | "applicationId"> = {
    requestYear: 2023,
    pluriannualYears: [2022, 2023, 2024],
    cofinancingRequested: false,
    paymentCondition: PaymentCondition.PHASED,
    conventionDate: new Date("2023-03-14"),
    decisionDate: new Date("2023-03-13"),
    depositDate: new Date("2023-03-12"),
    paymentPeriodDates: [new Date("2023-03-15"), new Date("2023-03-16")],
    paymentConditionDesc: "conditions",
    joinKeyDesc: "pour joindre",
    scheme: "dispositif",
    ej: "EJ0001",
    budgetaryYear: 2023,
    allocatorId: "123456789",
    managingAuthorityId: "012345678",
    beneficiaryEstablishmentId: DEFAULT_ASSOCIATION.siret, // a siret here
    confinancersId: [],
    joinKeyId: "joint001",
    idRAE: "RAEid",
    instructiveDepartementId: "890123456",
    applicationProviderId: "subv001",
    paymentId: PAYMENT_ID,
    grantedAmount: 15000,
    requestedAmount: 30000,
    totalAmount: 50000,
    nature: ApplicationNature.NATURE,
    allocatorName: "attribuant",
    managingAuthorityName: "autoriteGestion",
    instructiveDepartmentName: "serviceInstructeur",
    cofinancersNames: [],
    ueNotification: false,
    object: "objet",
    pluriannual: true,
    subventionPercentage: 100,
    provider: "osiris",
    decisionReference: "idDecision",
    subScheme: "sous-dispositif",
    statusLabel: ApplicationStatus.GRANTED,
    allocatorIdType: null,
    managingAuthorityIdType: null,
    beneficiaryEstablishmentIdType: Siret.getName(),
    cofinancersIdType: [],
    instructiveDepartmentIdType: null,
    updateDate: new Date("2025-12-12"),
};

// match chorus payment
export const APPLICATION_LINK_TO_CHORUS: ApplicationFlatEntity = {
    uniqueId: "osiris--subv001--2023",
    applicationId: "osiris--subv001",
    ...DRAFT_ENTITY,
} as ApplicationFlatEntity;

export const APPLICATION_LINK_TO_FONJEP: ApplicationFlatEntity = {
    uniqueId: "fonjep--subv002--2023",
    applicationId: "fonjep--subv002",
    ...{
        ...DRAFT_ENTITY,
        paymentId: FONJEP_PAYMENT_FLAT_ID_VERSEMENT,
        ej: "N/A",
        applicationProviderId: "subv002",
        provider: "fonjep",
    },
};

export const DBO: ApplicationFlatDbo = {
    _id: new ObjectId("684ad360b8e14612539db70c"),
    idUnique: APPLICATION_LINK_TO_CHORUS.uniqueId,
    idSubvention: APPLICATION_LINK_TO_CHORUS.applicationId,
    anneeDemande: APPLICATION_LINK_TO_CHORUS.requestYear,
    anneesPluriannualite: APPLICATION_LINK_TO_CHORUS.pluriannualYears,
    cofinancementsSollicites: false,
    conditionsVersements: PaymentCondition.PHASED,
    dateConvention: APPLICATION_LINK_TO_CHORUS.conventionDate,
    dateDecision: APPLICATION_LINK_TO_CHORUS.decisionDate,
    dateDepotDemande: APPLICATION_LINK_TO_CHORUS.depositDate,
    datesPeriodeVersement: APPLICATION_LINK_TO_CHORUS.paymentPeriodDates,
    descriptionConditionsVersements: "conditions",
    descriptionIdJointure: "pour joindre",
    dispositif: "dispositif",
    ej: "EJ0001",
    exerciceBudgetaire: APPLICATION_LINK_TO_CHORUS.budgetaryYear,
    idAttribuant: "123456789",
    idAutoriteGestion: "012345678",
    idEtablissementBeneficiaire: DEFAULT_ASSOCIATION.siret, // a siret here
    idCofinanceursSollicites: [],
    idJointure: "joint001",
    idRAE: "RAEid",
    idServiceInstructeur: "890123456",
    idSubventionProvider: APPLICATION_LINK_TO_CHORUS.applicationProviderId,
    idVersement: APPLICATION_LINK_TO_CHORUS.paymentId,
    montantAccorde: 15000,
    montantDemande: 30000,
    montantTotal: 50000,
    nature: ApplicationNature.NATURE,
    nomAttribuant: "attribuant",
    nomAutoriteGestion: "autoriteGestion",
    nomServiceInstructeur: "serviceInstructeur",
    nomsAttribuantsCofinanceurs: [],
    notificationUE: false,
    objet: "objet",
    pluriannualite: true,
    pourcentageSubvention: 100,
    fournisseur: APPLICATION_LINK_TO_CHORUS.provider,
    referenceDecision: "idDecision",
    sousDispositif: "sous-dispositif",
    statutLabel: ApplicationStatus.GRANTED,
    typeIdAttribuant: null,
    typeIdAutoriteGestion: null,
    typeIdEtablissementBeneficiaire: "siret",
    typeIdCofinanceursSollicites: [],
    typeIdServiceInstructeur: null,
    dateMiseAJour: new Date("2025-12-12"),
};
