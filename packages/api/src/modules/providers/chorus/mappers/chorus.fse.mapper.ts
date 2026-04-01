import { MandatoryFlatEntity } from "../../../../entities/flats/FlatEntity";
import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";
import EstablishmentIdentifier from "../../../../identifierObjects/EstablishmentIdentifier";
import Ridet from "../../../../identifierObjects/Ridet";
import Siret from "../../../../identifierObjects/Siret";
import Tahitiet from "../../../../identifierObjects/Tahitiet";
import { BRANCHE_ACCEPTED } from "../../../../shared/ChorusBrancheAccepted";
import { GenericAdapter } from "../../../../shared/GenericAdapter";
import { GenericParser } from "../../../../shared/GenericParser";
import { getShortISODate, isValidDate } from "../../../../shared/helpers/DateHelper";
import { santitizeFloat } from "../../../../shared/helpers/NumberHelper";
import { ChorusDto } from "../@types/ChorusDto";
import ChorusFseEntity from "../entities/ChorusFseEntity";
import ChorusMapper from "./chorus.mapper";

export class ChorusFseMapper {
    private static getIdentifier(dto: ChorusDto): Siret | Ridet | Tahitiet {
        const error = new Error("Error in Chorus format. No siret, ridet or tahitiet");
        const siret = dto["Code taxe 1"];
        const ridetOrTahitiet = dto["No TVA 3 (COM-RIDET ou TAHITI)"];
        if (siret === "#") {
            if (Ridet.isRidet(ridetOrTahitiet)) return new Ridet(ridetOrTahitiet);
            else if (Tahitiet.isTahitiet(ridetOrTahitiet)) return new Tahitiet(ridetOrTahitiet);
            else throw error;
        } else {
            if (Siret.isSiret(siret)) return new Siret(siret);
            else throw error;
        }
    }

    static dtoToEntity(dto: ChorusDto): ChorusFseEntity {
        const branchCode = dto["Branche CODE"];
        if (!BRANCHE_ACCEPTED[branchCode]) {
            throw new Error(`The branch ${branchCode} is not accepted in data`);
        }

        const amount = santitizeFloat(dto["Montant payé"]);
        if (isNaN(amount)) {
            throw new Error(`Amount is not a number`);
        }

        const operationDate = GenericParser.getDateFromXLSX(dto["Date de dernière opération sur la DP"]);
        if (!isValidDate(operationDate)) {
            throw new Error(`Operation date is not a valid date`);
        }

        return {
            ej: dto["N° EJ"],
            ejPostNum: dto["N° poste EJ"],
            identifier: this.getIdentifier(dto),
            branch: dto["Branche"],
            branchCode,
            programRef: dto["Référentiel de programmation"],
            programRefCode: dto["Référentiel de programmation CODE"],
            paymentRequestNum: dto["N° DP"],
            paymentRequestPostNum: dto["N° poste DP"],
            societyCode: dto["Société"],
            budgetaryYear: Number(dto["Exercice comptable"]),
            paidSupplierId: dto["Fournisseur payé (DP)"],
            beneficiaryName: dto["Désignation de la structure"],
            financialCenter: dto["Centre financier"],
            financialCenterCode: dto["Centre financier CODE"],
            functionalDomain: dto["Domaine fonctionnel"],
            functionalDomainCode: dto["Domaine fonctionnel CODE"],
            amount,
            operationDate,
            updateDate: new Date(),
        };
    }

    static toPaymentFlat(entity: ChorusFseEntity): PaymentFlatEntity {
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
