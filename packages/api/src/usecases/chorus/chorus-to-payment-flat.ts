import UseCase from "../../@types/use-case/UseCase";
import DomaineFonctionnelEntity from "../../entities/DomaineFonctionnelEntity";
import MinistryEntity from "../../entities/MinistryEntity";
import RefProgrammationEntity from "../../entities/RefProgrammationEntity";
import StateBudgetProgramEntity from "../../entities/StateBudgetProgramEntity";
import { Siret, Ridet } from "../../identifier-objects";
import { EstablishmentIdType } from "../../identifier-objects/@types/IdentifierType";
import { ChorusPaymentFlatEntity } from "../../modules/providers/chorus/@types/ChorusPaymentFlat";
import ChorusEntity from "../../domain/providers/chorus/ChorusEntity";
import { getShortISODate } from "../../shared/helpers/DateHelper";
import ChorusFseEntity from "../../domain/providers/chorus/ChorusFseEntity";
import dataBretagneService, { DataBretagneService } from "../../modules/providers/data-bretagne/data-bretagne.service";
import getRegionAttachementComptable, { GetRegionAttachementComptable } from "./get-region-attachement-comptable";

export class ChorusToPaymentFlat implements UseCase<
    {
        chorusEntity: ChorusEntity | ChorusFseEntity;
        programs: Record<string, StateBudgetProgramEntity>;
        ministries: Record<string, MinistryEntity>;
        fonctionalDomains: Record<string, DomaineFonctionnelEntity>;
        programsRef: Record<string, RefProgrammationEntity>;
    },
    ChorusPaymentFlatEntity
> {
    constructor(
        private dataBretagneService: DataBretagneService,
        private getRegion: GetRegionAttachementComptable,
    ) {}
    /**
     *   /!\ DO NOT USE THIS DIRECTLY TO PERSIT IN PAYMENT FLAT DATABASE /!\
     *
     *   Create a PaymentFlatEntity from a ChorusEntity
     *
     *   To get a "full" PaymentFlatEntity in order to process persistance in database,
     *   ensure to aggregate all PaymentFlatEntity by uniqueId and merge the amount
     */
    execute(input: {
        chorusEntity: ChorusEntity;
        programs: Record<string, StateBudgetProgramEntity>;
        ministries: Record<string, MinistryEntity>;
        fonctionalDomains: Record<string, DomaineFonctionnelEntity>;
        programsRef: Record<string, RefProgrammationEntity>;
    }): ChorusPaymentFlatEntity {
        const { chorusEntity, programs, ministries, fonctionalDomains, programsRef } = input;
        const {
            programCode,
            activityCode,
            actionCode,
            programEntity,
            ministryEntity,
            domaineFonctEntity,
            refProgrammationEntity,
        } = this.buildComplementaryData(chorusEntity, programs, ministries, fonctionalDomains, programsRef);

        const budgetaryYear = Number(chorusEntity.exercice);
        const beneficiaryEstablishmentId = chorusEntity.identifier;
        const beneficiaryCompanyId = this.getCompanyId(beneficiaryEstablishmentId);
        const beneficiaryEstablishmentIdType = beneficiaryEstablishmentId.name;
        const beneficiaryCompanyIdType = beneficiaryCompanyId.name;
        const accountingAttachment = chorusEntity.codeSociete;
        const accountingAttachmentRegion = this.getRegion.execute(chorusEntity.codeSociete);
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
            amount: chorusEntity.montant,
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
    private buildComplementaryData(
        chorusEntity: ChorusEntity,
        programs: Record<number, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        fonctionalDomains: Record<string, DomaineFonctionnelEntity>,
        programsRef: Record<string, RefProgrammationEntity>,
    ) {
        const { code: programCode, entity: programEntity } = this.getProgramCodeAndEntity(chorusEntity, programs);
        let ministryEntity: MinistryEntity | null = null;
        console.log(programEntity);
        if (programEntity) {
            ministryEntity = this.dataBretagneService.getMinistryEntity(programEntity, ministries);
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

    private getProgramCodeAndEntity(chorusEntity: ChorusEntity, programs: Record<string, StateBudgetProgramEntity>) {
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

    private getActivityCodeAndEntity(chorusEntity: ChorusEntity, programsRef: Record<string, RefProgrammationEntity>) {
        const code = chorusEntity.codeActivitee?.slice(-12);
        const entity = programsRef[code];
        if (!entity) {
            console.error(`RefProgrammation not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }

    private getActionCodeAndEntity(
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

    private getCompanyId(estabId: EstablishmentIdType) {
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
}

const chorusToPaymentFlat = new ChorusToPaymentFlat(dataBretagneService, getRegionAttachementComptable);
export default chorusToPaymentFlat;
