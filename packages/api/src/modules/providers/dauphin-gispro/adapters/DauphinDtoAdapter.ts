import { ApplicationNature, ApplicationStatus, DocumentDto, ProviderValue } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import dauphinService from "../dauphin.service";
import { toStatusFactory } from "../../providers.adapter";
import DauphinDocumentDto from "../dto/DauphinDocumentDto";
import { ApplicationFlatEntity } from "../../../../entities/ApplicationFlatEntity";
import { SimplifiedJoinedDauphinGispro } from "../@types/SimplifiedDauphinGispro";
import { GenericAdapter } from "../../../../shared/GenericAdapter";
import Siret from "../../../../identifierObjects/Siret";

export class InconsistentAggregationError extends Error {
    public field: string;
    public valueList: unknown[];
    public codeDossier: string | undefined;
    public referenceAdministrative: string[];

    constructor(
        field: string,
        valueList: unknown[],
        codeDossier: string | undefined,
        referenceAdministrative: string[],
    ) {
        const message = `Les valeurs suivantes du champ ${field} devraient être identiques mais ne le sont pas pour le dossier de code ${codeDossier} et les codes action ${referenceAdministrative} : ${valueList}`;
        super(message);
        this.field = field;
        this.valueList = valueList;
        this.codeDossier = codeDossier;
        this.referenceAdministrative = referenceAdministrative;
    }
}

export default class DauphinDtoAdapter {
    private static _statusConversionArray: { label: ApplicationStatus; providerStatusList: string[] }[] = [
        { label: ApplicationStatus.REFUSED, providerStatusList: ["Rejetée"] },
        {
            label: ApplicationStatus.GRANTED,
            providerStatusList: [
                "A justifier",
                "Justifiée",
                "A été versé",
                "Justification à modifier",
                "Justification en cours",
            ],
        },
        { label: ApplicationStatus.INELIGIBLE, providerStatusList: ["Cloturée", "Non recevable"] },
        {
            label: ApplicationStatus.PENDING,
            providerStatusList: [
                "Prise en charge",
                "Recevable",
                "Transmise",
                "En attente d'attestation",
                "En attente d'instruction",
                "En cours de saisie",
                "En cours",
            ],
        },
    ];

    private static getStatus(rawStatus: string) {
        return toStatusFactory(DauphinDtoAdapter._statusConversionArray)(rawStatus);
    }

    public static toDocuments(documentReferences: DauphinDocumentDto[]) {
        const resultArray: DocumentDto[] = [];
        let toPV: <T>(T) => ProviderValue<T>;
        for (const reference of documentReferences) {
            if (!reference.documents?.length) continue;
            for (const doc of reference.documents) {
                if (doc.error) continue;
                const date = new Date(doc.expand.properties["entity:document:date"].value);
                toPV = ProviderValueFactory.buildProviderValueAdapter(dauphinService.meta.name, new Date(date));
                resultArray.push({
                    type: toPV(reference.libelle.value),
                    url: toPV(
                        `/document/dauphin/?url=${encodeURIComponent(`https://agent-dauphin.cget.gouv.fr${doc.id}`)}`,
                    ),
                    nom: toPV(doc.title || reference.libelle.value),
                    __meta__: {},
                });
            }
        }
        return resultArray;
    }

    public static simplifiedJoinedToApplicationFlat(simplified: SimplifiedJoinedDauphinGispro): ApplicationFlatEntity {
        const getSingleValueOrNull = <T>(valueList: T[]) => (valueList.length === 1 ? valueList[0] : null);
        const getSingleValueOrThrow = <T>(valueList: T[], field: string) => {
            if (valueList.length === 0) return null;
            if (valueList.length === 1) return valueList[0];
            throw new InconsistentAggregationError(
                field,
                valueList,
                simplified.codeDossier,
                simplified.referenceAdministrative,
            );
        };

        const localId = simplified.referenceAdministrative.join("|");
        const dateDemandeStr = getSingleValueOrNull(simplified.dateDemande);
        const dateDemande = dateDemandeStr ? new Date(dateDemandeStr) : null;
        const status = getSingleValueOrThrow(
            [...new Set(simplified.virtualStatusLabel.map(this.getStatus))],
            "virtualStatusLabel",
        ) as ApplicationStatus;
        const ej = getSingleValueOrNull(simplified.ej);

        const adapted = {
            allocatorId: null,
            allocatorIdType: null,
            allocatorName: simplified.financeurs.join("|"),
            applicationId: "dauphin-" + localId,
            applicationProviderId: localId,
            beneficiaryEstablishmentId: simplified.siretDemandeur,
            beneficiaryEstablishmentIdType: Siret.getName(),
            budgetaryYear: simplified.exerciceBudgetaire,
            cofinancersIdType: null,
            cofinancersNames: null,
            cofinancingRequested: null,
            confinancersId: null,
            conventionDate: null,
            decisionDate: null,
            decisionReference: null,
            depositDate: dateDemande,
            ej,
            idRAE: null,
            instructiveDepartementId: null,
            instructiveDepartmentIdType: null,
            instructiveDepartmentName: simplified.instructorService.join("|"),
            joinKeyDesc: null,
            joinKeyId: null,
            managingAuthorityId: GenericAdapter.NOT_APPLICABLE_VALUE,
            managingAuthorityIdType: GenericAdapter.NOT_APPLICABLE_VALUE,
            managingAuthorityName: GenericAdapter.NOT_APPLICABLE_VALUE,
            nature: ApplicationNature.MONEY,
            object: simplified.intituleProjet.join("|"),
            paymentCondition: null,
            paymentConditionDesc: null,
            paymentId: [simplified.siretDemandeur, ej, simplified.exerciceBudgetaire].join(" - "),
            paymentPeriodDates: null,
            pluriannual: !(simplified.periode.length === 1 && simplified.periode[0] === "PONCTUELLE"),
            pluriannualYears: null,
            provider: "dauphin",
            requestYear: dateDemande?.getFullYear() || null,
            requestedAmount: simplified.montantDemande,
            grantedAmount: simplified.montantAccorde || null,
            scheme: simplified.thematique.join("|") + " - Politique de la ville",
            statusLabel: status,
            subScheme: null,
            subventionPercentage: null,
            totalAmount: null,
            ueNotification: null,
            uniqueId: "dauphin-" + localId + "-" + simplified.exerciceBudgetaire,
            updateDate: new Date(simplified.updateDate),
        };
        return adapted;
    }
}
