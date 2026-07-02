import { MandatoryFlatEntity } from "../../../../entities/flats/FlatEntity";
import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";
import { EstablishmentIdentifier } from "../../../../identifier-objects";
import { GenericAdapter } from "../../../../shared/GenericAdapter";
import { getShortISODate } from "../../../../shared/helpers/DateHelper";
import ChorusFseEntity from "../entities/ChorusFseEntity";
import ChorusMapper from "../mappers/chorus.mapper";

export class TransformFseToFlat {
    execute(entity: ChorusFseEntity): PaymentFlatEntity {
        const PROGRAM_NAMES_MAP = new Map([
            ["FSE", { code: "FSE+", desc: "Fonds social européen +" }],
            ["FTJ", { code: "FTJ", desc: "Fonds de transition juste" }],
        ]);

        const beneficiaryEstablishmentId = entity.identifier;
        const beneficiaryEstablishmentIdType = entity.identifier.name;
        const beneficiaryCompanyId = EstablishmentIdentifier.getAssociationIdentifier(entity.identifier);
        const beneficiaryCompanyIdType = beneficiaryCompanyId.name;

        const programNumber = PROGRAM_NAMES_MAP.get(entity.functionalDomainCode.slice(0, 3))?.code ?? "";
        const programName = PROGRAM_NAMES_MAP.get(entity.functionalDomainCode.slice(0, 3))?.desc ?? "";

        const optionalFields = {
            budgetaryYear: Number(entity.budgetaryYear),
            amount: entity.amount,
            operationDate: entity.operationDate,
            financialCenterCode: entity.financialCenterCode,
            financialCenterLabel: entity.financialCenter,
            accountingAttachment: entity.societyCode,
            // @TODO: inject this dependency
            accountingAttachmentRegion: ChorusMapper.getRegionAttachementComptable(entity.societyCode),
            programName,
            // @TODO: rename PaymentFlat.programNumber into programCode to be more accurate
            programNumber,
            mission: GenericAdapter.NOT_APPLICABLE_VALUE,
            ministry: GenericAdapter.NOT_APPLICABLE_VALUE,
            ministryAcronym: GenericAdapter.NOT_APPLICABLE_VALUE,
            actionCode: entity.functionalDomainCode,
            actionLabel: entity.functionalDomain,
            activityCode: GenericAdapter.NOT_APPLICABLE_VALUE,
            activityLabel: GenericAdapter.NOT_APPLICABLE_VALUE,
            ej: GenericAdapter.NOT_APPLICABLE_VALUE,
        };
        // this keeps the same structure as other providers payment flat uniqueId and add N/A for the missing fields
        // @TODO: get rid of this id structure with N/A ??
        const paymentId = `${beneficiaryEstablishmentId.value}-${GenericAdapter.NOT_APPLICABLE_VALUE}-${entity.budgetaryYear}`;

        // this keeps the same structure as other providers payment flat uniqueId and add N/A for the missing fields
        // @TODO: if the structure must be kept, make this a helper with partial<paymentFlat> as entry
        const uniqueId = `chorus-fse-${paymentId}-${optionalFields.programNumber}-${optionalFields.actionCode}-${optionalFields.activityCode}-${getShortISODate(optionalFields.operationDate)}-${optionalFields.accountingAttachment}-${optionalFields.financialCenterCode}`;

        const mandatoryFields: MandatoryFlatEntity = {
            uniqueId,
            beneficiaryEstablishmentIdType,
            beneficiaryEstablishmentId,
            beneficiaryCompanyIdType,
            beneficiaryCompanyId,
            provider: "chorus-fse",
            updateDate: entity.updateDate,
        };

        return { ...mandatoryFields, ...optionalFields, paymentId, uniqueId };
    }
}

const transformFseToFlat = new TransformFseToFlat();
export default transformFseToFlat;
