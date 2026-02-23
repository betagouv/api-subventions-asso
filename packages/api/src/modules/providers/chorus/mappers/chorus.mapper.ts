import * as Sentry from "@sentry/node";
import { getShortISODate } from "../../../../shared/helpers/DateHelper";
import ChorusLineEntity from "../entities/ChorusLineEntity";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";
import StateBudgetProgramEntity from "../../../../entities/StateBudgetProgramEntity";
import MinistryEntity from "../../../../entities/MinistryEntity";
import DomaineFonctionnelEntity from "../../../../entities/DomaineFonctionnelEntity";
import Siret from "../../../../identifierObjects/Siret";
import RefProgrammationEntity from "../../../../entities/RefProgrammationEntity";
import { GenericParser } from "../../../../shared/GenericParser";
import { ChorusLineDto } from "../@types/ChorusLineDto";
import { ChorusPaymentFlatEntity, ChorusPaymentFlatRaw } from "../@types/ChorusPaymentFlat";
import Ridet from "../../../../identifierObjects/Ridet";
import { EstablishmentIdType } from "../../../../identifierObjects/@types/IdentifierType";
import Tahitiet from "../../../../identifierObjects/Tahitiet";
import REGION_MAPPING from "./ChorusRegionMapping";
import { NOT_APPLICABLE_VALUE } from "core";

export default class ChorusMapper {
    // TODO: get this from enum and in lower case
    static PROVIDER_NAME = "Chorus";

    public static getRegionAttachementComptable(attachementComptable: string) {
        if (attachementComptable == NOT_APPLICABLE_VALUE) return NOT_APPLICABLE_VALUE;

        const region = REGION_MAPPING[attachementComptable];
        if (region === undefined) {
            const errorMessage = `Unknown region code: ${attachementComptable}`;
            Sentry.captureException(new Error(errorMessage));
            console.error(errorMessage);
            return null;
        }
        return region;
    }

    private static getEstablishmentValueObject(chorusLineDto: ChorusLineDto): EstablishmentIdType {
        const RIDET_TAHITIET_COLUMN_NAME = "No TVA 3 (COM-RIDET ou TAHITI)";
        const SIRET_COLUMN_NAME = "Code taxe 1";
        if (chorusLineDto[SIRET_COLUMN_NAME] === "#") {
            // special case spotted after handling ridet and tahiti in V0.67
            // sometime chorus line doesn't have any siret nor ridet or tahiti
            if (chorusLineDto[RIDET_TAHITIET_COLUMN_NAME] === "#") {
                throw new Error(
                    `Not able to retrieve an establishment identifier for chorus line with EJ ${chorusLineDto["N° EJ"]} for exercice ${chorusLineDto["Exercice comptable"]}`,
                );
            }
            if (Ridet.isRidet(chorusLineDto[RIDET_TAHITIET_COLUMN_NAME])) {
                return new Ridet(chorusLineDto[RIDET_TAHITIET_COLUMN_NAME]);
            } else {
                return new Tahitiet(chorusLineDto[RIDET_TAHITIET_COLUMN_NAME]);
            }
        } else return new Siret(chorusLineDto[SIRET_COLUMN_NAME]);
    }

    // TODO: add to ValueObject a getCompanyId that would abstract the notion of siren/rid/tahiti ?
    private static getCompanyId(estabId: EstablishmentIdType) {
        if (estabId instanceof Siret) {
            return estabId.toSiren();
        } else if (estabId instanceof Ridet) {
            return estabId.toRid();
        }
        // Tahitiet
        else {
            return estabId.toTahiti();
        }
    }

    private static getAmount(chorusLineDto: ChorusLineDto): number | null {
        const amount = chorusLineDto["Montant payé"];
        if (!amount || typeof amount === "number") return amount;
        if (typeof amount === "string")
            // @ts-expect-error: this should not be a string but was in the original code refactored with #3342
            // Plus, after unit testing it it throws a TypeError because the RegExp doesn't have the g flag (added in #3342)
            return parseFloat(amount.replaceAll(/[\r ]/g, "").replace(",", "."));
        // this should never happen
        else return null;
    }

    private static getOperationDate(chorusLineDto: ChorusLineDto): Date | null {
        const operationDate = chorusLineDto["Date de dernière opération sur la DP"];

        if (!operationDate) return null;

        if (typeof operationDate === "number") {
            return GenericParser.ExcelDateToJSDate(operationDate);
        } else {
            const operationDateFromStr = parseInt(operationDate, 10);
            // if operationDate is DD/MM/YYYY ? Is this realy possible ? This code is old and was refactored in #3342
            if (operationDate != operationDateFromStr.toString()) {
                const [day, month, year] = operationDate.split(/[/.]/).map(v => parseInt(v, 10));
                return new Date(Date.UTC(year, month - 1, day));
            } else {
                return GenericParser.ExcelDateToJSDate(parseInt(operationDate, 10));
            }
        }
    }

    private static getEntitiesByIdentifierRawData(data: ChorusLineDto): ChorusPaymentFlatRaw {
        const budgetaryYear = data["Exercice comptable"] ? parseInt(data["Exercice comptable"], 10) : null;
        const beneficiaryEstablishmentId = this.getEstablishmentValueObject(data);
        const beneficiaryCompanyId = this.getCompanyId(beneficiaryEstablishmentId);
        const beneficiaryEstablishmentIdType = beneficiaryEstablishmentId.name;
        const beneficiaryCompanyIdType = beneficiaryCompanyId.name;

        // all nullable error should be handled with issue #3345
        return {
            //@ts-expect-error: this should be nullable but was in the original code refactored with #3342
            budgetaryYear,
            beneficiaryEstablishmentIdType,
            beneficiaryEstablishmentId,
            beneficiaryCompanyIdType,
            beneficiaryCompanyId,
            //@ts-expect-error: this should be nullable but was in the original code refactored with #3342
            amount: this.getAmount(data),
            //@ts-expect-error: this should be nullable but was in the original code refactored with #3342
            operationDate: this.getOperationDate(data),
            //@ts-expect-error: this should be nullable but was in the original code refactored with #3342
            ej: data["N° EJ"],
            financialCenterCode: data["Centre financier CODE"],
            financialCenterLabel: data["Centre financier"],
            //@ts-expect-error: this should be nullable but was in the original code refactored with #3342
            accountingAttachment: data["Société"],
        };
    }

    /**
     *   /!\ DO NOT USE THIS DIRECTLY TO PERSIT IN PAYMENT FLAT DATABASE /!\
     *
     *   Create a PaymentFlatEntity from a ChorusLineEntity
     *
     *   To get a "full" PaymentFlatEntity in order to process persistance in database,
     *   ensure to aggregate all PaymentFlatEntity by uniqueId and merge the amount
     */
    public static toNotAggregatedPaymentFlatEntity(
        chorusDocument: ChorusLineEntity,
        programs: Record<string, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        fonctionalDomains: Record<string, DomaineFonctionnelEntity>,
        programsRef: Record<string, RefProgrammationEntity>,
    ): ChorusPaymentFlatEntity {
        const {
            programCode,
            activityCode,
            actionCode,
            programEntity,
            ministryEntity,
            domaineFonctEntity,
            refProgrammationEntity,
        } = this.getEntitiesByIdentifierComplementaryData(
            chorusDocument.data as ChorusLineDto,
            programs,
            ministries,
            fonctionalDomains,
            programsRef,
        );

        const rawDataWithDataBretagne: Omit<
            ChorusPaymentFlatEntity,
            "accountingAttachmentRegion" | "paymentId" | "uniqueId"
        > = {
            ...this.getEntitiesByIdentifierRawData(chorusDocument.data as ChorusLineDto),
            programName: programEntity?.label_programme ?? null,
            programNumber: programCode,
            mission: programEntity?.mission ?? null,
            ministry: ministryEntity?.nom_ministere ?? null,
            ministryAcronym: ministryEntity?.sigle_ministere ?? null,
            actionCode,
            actionLabel: domaineFonctEntity?.libelle_action ?? null,
            activityCode,
            activityLabel: refProgrammationEntity?.libelle_activite ?? null,
            provider: this.PROVIDER_NAME.toLowerCase(), // TODO: get this from config / code => see #3338
            updateDate: chorusDocument.updateDate,
        };

        const paymentId = `${rawDataWithDataBretagne.beneficiaryEstablishmentId.value}-${rawDataWithDataBretagne.ej}-${rawDataWithDataBretagne.budgetaryYear}`;
        const accountingAttachmentRegion = ChorusMapper.getRegionAttachementComptable(
            rawDataWithDataBretagne.accountingAttachment,
        );
        const partialPaymentFlat: Omit<ChorusPaymentFlatEntity, "uniqueId"> = {
            paymentId,
            accountingAttachmentRegion,
            ...rawDataWithDataBretagne,
        };
        const uniqueId = this.buildFlatUniqueId(partialPaymentFlat);

        return {
            uniqueId,
            ...partialPaymentFlat,
        };
    }

    private static buildFlatUniqueId(partialPaymentFlat: Omit<ChorusPaymentFlatEntity, "uniqueId">) {
        const {
            paymentId,
            programNumber,
            actionCode,
            activityCode,
            operationDate,
            accountingAttachment,
            financialCenterCode,
        } = partialPaymentFlat;

        return `chorus-${paymentId}-${programNumber}-${actionCode}-${activityCode}-${getShortISODate(operationDate)}-${accountingAttachment}-${financialCenterCode}`;
    }

    private static getProgramCodeAndEntity(
        chorusDto: ChorusLineDto,
        programs: Record<string, StateBudgetProgramEntity>,
    ) {
        // trick to trim 0 at the beginning of the code
        // i.e "0161" => "161"
        const code = parseInt(chorusDto["Domaine fonctionnel CODE"]?.slice(1, 4));
        const entity = programs[String(code)];
        if (!entity) {
            console.error(`Program not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }

    private static getActivityCodeAndEntity(
        chorusDto: ChorusLineDto,
        programsRef: Record<string, RefProgrammationEntity>,
    ) {
        const code = chorusDto["Référentiel de programmation CODE"]?.slice(-12);
        const entity = programsRef[code];
        if (!entity) {
            console.error(`RefProgrammation not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }

    private static getActionCodeAndEntity(
        chorusDto: ChorusLineDto,
        fonctionalDomains: Record<string, DomaineFonctionnelEntity>,
    ) {
        const code = chorusDto["Domaine fonctionnel CODE"];
        const entity = fonctionalDomains[code];
        if (!entity) {
            console.error(`DomaineFonctionnel not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }

    /**
     *
     * Fetch the complementary data from dataBretagne API / collection
     *
     * @param chorusDocument A ChorusLineDto object
     * @param programs state programs from state-budget-programs collection
     * @param ministries ministries from dataBretagne API
     * @param fonctionalDomains fonctionalDomains from dataBretagne API
     * @param programsRef programsRef from dataBretagne API
     *
     * @returns Object containing complementary data if found, otherwise null
     */
    private static getEntitiesByIdentifierComplementaryData(
        chorusDocument: ChorusLineDto,
        programs: Record<number, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        fonctionalDomains: Record<string, DomaineFonctionnelEntity>,
        programsRef: Record<string, RefProgrammationEntity>,
    ) {
        const { code: programCode, entity: programEntity } = this.getProgramCodeAndEntity(chorusDocument, programs);
        let ministryEntity: MinistryEntity | null = null;
        if (programEntity) {
            ministryEntity = dataBretagneService.getMinistryEntity(programEntity, ministries);
        }

        const { code: activityCode, entity: refProgrammationEntity } = this.getActivityCodeAndEntity(
            chorusDocument,
            programsRef,
        );

        const { code: actionCode, entity: domaineFonctEntity } = this.getActionCodeAndEntity(
            chorusDocument,
            fonctionalDomains,
        );

        return {
            programCode,
            activityCode,
            actionCode,
            programEntity,
            ministryEntity,
            domaineFonctEntity,
            refProgrammationEntity,
        };
    }
}
