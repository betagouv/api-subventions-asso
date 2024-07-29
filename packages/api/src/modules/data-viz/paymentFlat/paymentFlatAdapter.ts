import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import MinistryEntity from "../../../entities/MinistryEntity";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import IChorusIndexedInformations from "../../providers/chorus/@types/IChorusIndexedInformations";

export default class PaymentFlatAdapter {
    static toPaymentFlatEntity(
        chorusDocument: IChorusIndexedInformations,
        programs: Record<string, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        domainesFonct: Record<string, DomaineFonctionnelEntity>,
        refsProgrammation: Record<string, RefProgrammationEntity>,
    ): PaymentFlatEntity {
        const programCode = parseInt(chorusDocument.codeDomaineFonctionnel?.slice(1, 4), 10);
        const activityCode = chorusDocument.codeActivitee?.slice(-12);
        const actionCode = chorusDocument.codeDomaineFonctionnel;

        const program = programCode ? programs[programCode] : undefined;
        if (!program) {
            console.error(`Program not found for programCode: ${programCode}`);
        }
        const ministry = program ? ministries[program.code_ministere] : undefined;
        if (!ministry) {
            console.error(`Ministry not found for programCode: ${programCode}`);
        }
        const domaineFonct = actionCode ? domainesFonct[actionCode] : undefined;
        if (!domaineFonct) {
            console.error(`DomaineFonctionnel not found for actionCode: ${actionCode}`);
        }
        const refProgrammation = activityCode ? refsProgrammation[activityCode] : undefined;
        if (!refProgrammation) {
            console.error(`RefProgrammation not found for activityCode: ${activityCode}`);
        }

        // TO ADD ABOVE : if undefined => enregistre error sur mattermost

        return new PaymentFlatEntity(
            chorusDocument.siret, // siret,
            chorusDocument.siret.slice(0, 9), // siren,
            chorusDocument.amount, // amount,
            chorusDocument.dateOperation, // operationDate,
            program?.label_programme ?? null, // programName,
            programCode, // programNumber,
            program?.mission ?? null, // mission,
            ministry?.nom_ministere ?? null, // ministry,
            ministry?.sigle_ministere ?? null, // ministryAcronym,
            chorusDocument.ej, // ej,
            "chorus", // provider,
            actionCode, // actionCode,
            domaineFonct?.libelle_action ?? null, // actionLabel,
            activityCode ?? null, // activityCode,
            refProgrammation?.libelle_activite ?? null, // activityLabel
        );
    }
}
