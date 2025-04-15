import { ApplicationStatus } from "dto";
import { ApplicationFlatEntity, ApplicationNature, PaymentCondition } from "../../../entities/ApplicationFlatEntity";

export const DRAFT = {
    anneeDemande: 2015,
    anneesPluriannualite: [2042, 2043, 2044],
    cofinancementsSollicites: false,
    conditionsVersements: PaymentCondition.PHASED,
    dateConvention: new Date("2015-03-14"),
    dateDecision: new Date("2015-03-13"),
    dateDepotDemande: new Date("2015-03-12"),
    datesPeriodeVersement: [new Date("2015-03-15"), new Date("2015-03-16")],
    descriptionConditionsVersements: "conditions",
    descriptionIdJointure: "pour joindre",
    dispositif: "dispositif",
    ej: "EJ0001",
    exerciceBudgetaire: 2015,
    idAttribuant: "123456789",
    idAutoriteGestion: "012345678",
    idBeneficiaire: "12345678901234", // a siret here
    idCofinanceursSollicites: [],
    idJointure: "joint001",
    idRAE: "RAEid",
    idServiceInstructeur: "890123456",
    idSubventionProvider: "subv001",
    idVersement: "idv",
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
    provider: "provider",
    referenceDecision: "idDecision",
    sousDispositif: "sous-dispositif",
    statutLabel: ApplicationStatus.GRANTED,
    typeIdAttribuant: undefined,
    typeIdAutoriteGestion: undefined,
    typeIdBeneficiaire: "",
    typeIdCofinanceursSollicites: [],
    typeIdServiceInstructeur: undefined,
};

export const ENTITY = {
    idUnique: "provider--subv001",
    idSubvention: "provider--subv001--2015",
    ...DRAFT,
} as ApplicationFlatEntity;
