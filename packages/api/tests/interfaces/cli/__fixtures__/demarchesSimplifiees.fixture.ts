import DemarchesSimplifieesSchema from "../../../../src/modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesSchema";
import { DemarchesSimplifieesSuccessDto } from "../../../../src/modules/providers/demarchesSimplifiees/dto/DemarchesSimplifieesDto";
import { SIRET_STR } from "../../../__fixtures__/association.fixture";
import DemarchesSimplifieesDataEntity from "../../../../src/modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesDataEntity";
import { ApplicationFlatEntity } from "../../../../src/entities/flats/ApplicationFlatEntity";
import { ApplicationStatus } from "dto";

export const DEMARCHE_ID = 42;
export const SCHEMA: DemarchesSimplifieesSchema = {
    demarcheId: DEMARCHE_ID,
    flatSchema: [
        {
            value: "Direction instructrice",
            to: "service_instructeur",
        },
        {
            from: "siret",
            to: "beneficiaryEstablishmentId",
        },
        {
            from: "demande.state",
            to: "status",
        },
        {
            from: "demande.annotations.Q2hhbXAtMjUzOTIyMA==.value",
            to: "grantedAmount",
        },
        {
            from: "demande.champs.Q2hhbXAtMjUwNjg0MA==.value",
            to: "requestedAmount",
        },
        {
            from: "demande.champs.Q2hhbXAtMjM2MzQwMg==.value",
            to: "objet",
        },
        {
            from: "demande.dateDepot",
            to: "depositDate",
        },
        {
            value: 2025,
            to: "budgetaryYear",
        },
        {
            from: "demande.demarche.title",
            to: "scheme",
        },
        {
            from: "demande.dateDerniereModification",
            to: "updateDate",
        },
        {
            from: "demande.id",
            to: "applicationProviderId",
        },
    ],
    // the two following schemas are not used by the cli, only after through http
    commonSchema: [],
    schema: [],
};

export const DS_DTO: DemarchesSimplifieesSuccessDto = {
    errors: undefined,
    data: {
        demarche: {
            dossiers: {
                nodes: [
                    {
                        annotations: [
                            { id: "Q2hhbXAtMjUzOTIyMA==", stringValue: "", label: "Montant de la subvention accordé" },
                        ],
                        champs: [
                            {
                                id: "Q2hhbXAtMjUwNjg0MA==",
                                stringValue: "5000",
                                label: "... demander une subvention de",
                            },
                            {
                                id: "Q2hhbXAtMjM2MzQwMg==",
                                stringValue: "Journée d'étude des conseillers VPAH à Vannes",
                                label: "Intitulé du projet",
                            },
                        ],
                        dateDepot: "2012-12-12",
                        dateDerniereModification: "2022-12-22",
                        datePassageEnInstruction: "2018-12-18",
                        dateTraitement: "2020-12-20",
                        demandeur: {
                            siret: SIRET_STR,
                        },
                        id: "some-long-id",
                        demarche: {
                            title: "Démarches fixture title",
                        },
                        groupeInstructeur: {
                            label: "Instructeur de fixture",
                        },
                        motivation: null,
                        state: "accepte",
                        pdf: {
                            url: "",
                            filename: "",
                            contentType: "",
                        },
                    },
                ],
                pageInfo: {
                    endCursor: "",
                    hasNextPage: false,
                    hasPreviousPage: false,
                },
            },
            service: {
                nom: "Service de fixture",
                organisme: "Organisme du service de fixture",
            },
            state: "publiee",
        },
    },
};

export const DS_ENTITY: DemarchesSimplifieesDataEntity = {
    siret: SIRET_STR,
    demarcheId: DEMARCHE_ID,
    demande: {
        annotations: {
            "Q2hhbXAtMjUzOTIyMA==": {
                value: "",
                label: "Montant de la subvention accordé",
            },
        },
        champs: {
            "Q2hhbXAtMjUwNjg0MA==": {
                value: "5000",
                label: "... demander une subvention de",
            },
            "Q2hhbXAtMjM2MzQwMg==": {
                value: "Journée d'étude des conseillers VPAH à Vannes",
                label: "Intitulé du projet",
            },
        },
        dateDepot: "2012-12-12",
        dateDerniereModification: "2022-12-22",
        datePassageEnInstruction: "2018-12-18",
        dateTraitement: "2020-12-20",
        demandeur: {
            siret: "10000000000001",
        },
        id: "some-long-id",
        demarche: {
            title: "Démarches fixture title",
        },
        groupeInstructeur: {
            label: "Instructeur de fixture",
        },
        motivation: null,
        state: "accepte",
        pdf: {
            url: "",
            filename: "",
            contentType: "",
        },
    },
    service: {
        nom: "Service de fixture",
        organisme: "Organisme du service de fixture",
    },
} as DemarchesSimplifieesDataEntity; // TODO

export const DS_FLAT: ApplicationFlatEntity = {
    uniqueId: "demarches-simplifiees-42-some-long-id-2025",
    applicationId: "demarches-simplifiees-42-some-long-id",
    applicationProviderId: "some-long-id",
    provider: "demarches-simplifiees-42",
    beneficiaryEstablishmentId: "10000000000001",
    beneficiaryEstablishmentIdType: "siret",
    budgetaryYear: 2025,
    depositDate: new Date("2012-12-12T00:00:00.000Z"),
    requestYear: 2012,
    scheme: "Démarches fixture title",
    requestedAmount: 5000,
    paymentId: "10000000000001-null-2025",

    statusLabel: ApplicationStatus.GRANTED,
    updateDate: new Date("2022-12-22"),

    allocatorId: null,
    allocatorIdType: null,
    allocatorName: null,
    cofinancersIdType: null,
    cofinancersNames: null,
    cofinancingRequested: null,
    confinancersId: null,
    conventionDate: null,
    decisionDate: null,
    decisionReference: null,
    ej: null,
    grantedAmount: null,
    idRAE: null,
    instructiveDepartementId: null,
    instructiveDepartmentIdType: null,
    instructiveDepartmentName: null,
    joinKeyDesc: null,
    joinKeyId: null,
    managingAuthorityId: null,
    managingAuthorityIdType: null,
    managingAuthorityName: null,
    nature: null,
    object: null,
    paymentCondition: null,
    paymentConditionDesc: null,
    paymentPeriodDates: null,
    pluriannual: null,
    pluriannualYears: null,
    subScheme: null,
    subventionPercentage: null,
    totalAmount: null,
    ueNotification: null,
};
