import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import MinistryEntity from "../../../entities/MinistryEntity";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import Siret from "../../../valueObjects/Siret";
import IChorusIndexedInformations from "../../providers/chorus/@types/IChorusIndexedInformations";
import ChorusLineEntity from "../../providers/chorus/entities/ChorusLineEntity";

export default class PaymentFlatAdapter {
    static toPaymentFlatEntity(
        chorusDocument: ChorusLineEntity,
        programs: Record<string, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        domainesFonct: Record<string, DomaineFonctionnelEntity>,
        refsProgrammation: Record<string, RefProgrammationEntity>,
    ): PaymentFlatEntity {
        const {
            programCode,
            activityCode,
            actionCode,
            programEntity,
            ministryEntity,
            domaineFonctEntity,
            refProgrammationEntity,
        } = this.getDataBretagneDocumentData(
            chorusDocument.indexedInformations,
            programs,
            ministries,
            domainesFonct,
            refsProgrammation,
        );

        return new PaymentFlatEntity(
            chorusDocument.uniqueId, // uniqueId,
            new Siret(chorusDocument.indexedInformations.siret), // siret,
            new Siret(chorusDocument.indexedInformations.siret).toSiren(), // siren,
            chorusDocument.indexedInformations.amount, // amount,
            chorusDocument.indexedInformations.dateOperation, // operationDate,
            programEntity?.label_programme ?? null, // programName,
            programCode, // programNumber,
            programEntity?.mission ?? null, // mission,
            ministryEntity?.nom_ministere ?? null, // ministry,
            ministryEntity?.sigle_ministere ?? null, // ministryAcronym,
            chorusDocument.indexedInformations.ej, // ej,
            "chorus", // provider,
            actionCode, // actionCode,
            domaineFonctEntity?.libelle_action ?? null, // actionLabel,
            activityCode ?? null, // activityCode,
            refProgrammationEntity?.libelle_activite ?? null, // activityLabel
        );
    }

    private static getDataBretagneDocumentData(
        chorusDocument: IChorusIndexedInformations,
        programs: Record<number, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        domainesFonct: Record<string, DomaineFonctionnelEntity>,
        refsProgrammation: Record<string, RefProgrammationEntity>,
    ) {
        const programCode = parseInt(chorusDocument.codeDomaineFonctionnel?.slice(1, 4), 10);
        const activityCode = chorusDocument.codeActivitee?.slice(-12);
        const actionCode = chorusDocument.codeDomaineFonctionnel;

        const programEntity = programs[programCode] ?? undefined;
        if (!programEntity) {
            console.error(`Program not found for programCode: ${programCode}`);
        }
        const ministryEntity = programEntity ? ministries[programEntity.code_ministere] : undefined;
        if (!ministryEntity) {
            console.error(`Ministry not found for ministry: ${programEntity?.code_ministere}`);
        }
        const domaineFonctEntity = domainesFonct[actionCode] ?? undefined;
        if (!domaineFonctEntity) {
            console.error(`DomaineFonctionnel not found for actionCode: ${actionCode}`);
        }
        const refProgrammationEntity = activityCode ? refsProgrammation[activityCode] : undefined;
        if (!refProgrammationEntity) {
            console.error(`RefProgrammation not found for activityCode: ${activityCode}`);
        }
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
