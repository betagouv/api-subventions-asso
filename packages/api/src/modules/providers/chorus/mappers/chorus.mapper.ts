import type ChorusEntity from "../entities/ChorusEntity";
import type StateBudgetProgramEntity from "../../../../entities/StateBudgetProgramEntity";
import type MinistryEntity from "../../../../entities/MinistryEntity";
import type DomaineFonctionnelEntity from "../../../../entities/DomaineFonctionnelEntity";
import type RefProgrammationEntity from "../../../../entities/RefProgrammationEntity";
import type { ChorusPaymentFlatEntity } from "../@types/ChorusPaymentFlat";
import type { EstablishmentIdType } from "../../../../identifierObjects/@types/IdentifierType";

import dataBretagneService from "../../dataBretagne/dataBretagne.service";
import Siret from "../../../../identifierObjects/Siret";
import Ridet from "../../../../identifierObjects/Ridet";
import Tahitiet from "../../../../identifierObjects/Tahitiet";
import { getShortISODate } from "../../../../shared/helpers/DateHelper";
import REGION_MAPPING from "./ChorusRegionMapping";
import { NOT_APPLICABLE_VALUE } from "core";

export default class ChorusMapper {
    public static getRegionAttachementComptable(attachementComptable: string): string | null {
        if (attachementComptable == NOT_APPLICABLE_VALUE) return NOT_APPLICABLE_VALUE;

        const region = REGION_MAPPING[attachementComptable];
        if (region === undefined) {
            const errorMessage = `Unknown region code: ${attachementComptable}`;
            console.error(errorMessage);
            return null;
        }
        return region;
    }

    private static getEstablishmentValueObject(entity: ChorusEntity): EstablishmentIdType {
        if (Siret.isSiret(entity.siret)) return new Siret(entity.siret);
        if (Ridet.isRidet(entity.ridetOrTahitiet)) return new Ridet(entity.ridetOrTahitiet);
        if (Tahitiet.isTahitiet(entity.ridetOrTahitiet)) return new Tahitiet(entity.ridetOrTahitiet);
        else
            throw new Error(
                `Not able to retrieve an establishment identifier for chorus entity with EJ ${entity.ej} for exercice ${entity.exercice}`,
            );
    }

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

    /**
     *   /!\ DO NOT USE THIS DIRECTLY TO PERSIT IN PAYMENT FLAT DATABASE /!\
     *
     *   Create a PaymentFlatEntity from a ChorusEntity
     *
     *   To get a "full" PaymentFlatEntity in order to process persistance in database,
     *   ensure to aggregate all PaymentFlatEntity by uniqueId and merge the amount
     */
    public static toNotAggregatedPaymentFlatEntity(
        chorusEntity: ChorusEntity,
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
        } = this.buildComplementaryData(chorusEntity, programs, ministries, fonctionalDomains, programsRef);

        const budgetaryYear = chorusEntity.exercice;
        const beneficiaryEstablishmentId = this.getEstablishmentValueObject(chorusEntity);
        const beneficiaryCompanyId = this.getCompanyId(beneficiaryEstablishmentId);
        const beneficiaryEstablishmentIdType = beneficiaryEstablishmentId.name;
        const beneficiaryCompanyIdType = beneficiaryCompanyId.name;
        const accountingAttachment = chorusEntity.codeSociete;
        const accountingAttachmentRegion = this.getRegionAttachementComptable(chorusEntity.codeSociete);
        const paymentId = `${beneficiaryEstablishmentId.value}-${chorusEntity.ej}-${budgetaryYear}`;
        const programNumber = programCode;
        const uniqueId = `chorus-${paymentId}-${programNumber}-${actionCode}-${activityCode}-${getShortISODate(chorusEntity.dateOperation)}-${accountingAttachment}-${chorusEntity.codeCentreFinancier}`;

        return {
            uniqueId,
            paymentId: `${beneficiaryEstablishmentId.value}-${chorusEntity.ej}-${budgetaryYear}`,
            budgetaryYear,
            beneficiaryEstablishmentIdType,
            beneficiaryEstablishmentId,
            beneficiaryCompanyIdType,
            beneficiaryCompanyId,
            amount: chorusEntity.amount,
            operationDate: chorusEntity.dateOperation,
            ej: chorusEntity.ej,
            financialCenterCode: chorusEntity.codeCentreFinancier,
            financialCenterLabel: chorusEntity.centreFinancier,
            accountingAttachment,
            accountingAttachmentRegion,
            programName: programEntity?.label_programme ?? null,
            programNumber,
            mission: programEntity?.mission ?? null,
            ministry: ministryEntity?.nom_ministere ?? null,
            ministryAcronym: ministryEntity?.sigle_ministere ?? null,
            actionCode,
            actionLabel: domaineFonctEntity?.libelle_action ?? null,
            activityCode,
            activityLabel: refProgrammationEntity?.libelle_activite ?? null,
            provider: "chorus",
            updateDate: chorusEntity.updateDate,
        };
    }

    /**
     *
     * Fetch the complementary data from DataBretagne (Data Etat
     *
     * @param chorusEntity A ChoruseEntity
     * @param programs state programs from state-budget-programs collection
     * @param ministries ministries from dataBretagne API
     * @param fonctionalDomains fonctionalDomains from dataBretagne API
     * @param programsRef programsRef from dataBretagne API
     *
     * @returns Object containing complementary data if found, otherwise null
     */
    private static buildComplementaryData(
        chorusEntity: ChorusEntity,
        programs: Record<number, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        fonctionalDomains: Record<string, DomaineFonctionnelEntity>,
        programsRef: Record<string, RefProgrammationEntity>,
    ) {
        const { code: programCode, entity: programEntity } = this.getProgramCodeAndEntity(chorusEntity, programs);
        let ministryEntity: MinistryEntity | null = null;
        if (programEntity) {
            ministryEntity = dataBretagneService.getMinistryEntity(programEntity, ministries);
        }

        const { code: activityCode, entity: refProgrammationEntity } = this.getActivityCodeAndEntity(
            chorusEntity,
            programsRef,
        );

        const { code: actionCode, entity: domaineFonctEntity } = this.getActionCodeAndEntity(
            chorusEntity,
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

    private static getProgramCodeAndEntity(
        chorusEntity: ChorusEntity,
        programs: Record<string, StateBudgetProgramEntity>,
    ) {
        // trick to trim 0 at the beginning of the code
        // i.e "0161" => "161"
        const code = parseInt(chorusEntity.codeDomaineFonctionnel?.slice(1, 4));
        const entity = programs[String(code)];
        if (!entity) {
            console.error(`Program not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }

    private static getActivityCodeAndEntity(
        chorusEntity: ChorusEntity,
        programsRef: Record<string, RefProgrammationEntity>,
    ) {
        const code = chorusEntity.codeActivitee?.slice(-12);
        const entity = programsRef[code];
        if (!entity) {
            console.error(`RefProgrammation not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }

    private static getActionCodeAndEntity(
        chorusEntity: ChorusEntity,
        fonctionalDomains: Record<string, DomaineFonctionnelEntity>,
    ) {
        const code = chorusEntity.codeDomaineFonctionnel;
        const entity = fonctionalDomains[code];
        if (!entity) {
            console.error(`DomaineFonctionnel not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }
}
