import { BasePayment, ChorusPayment, FonjepPayment, Payment, PaymentFlatDto } from "dto";
import PaymentFlatEntity from "../../entities/flats/PaymentFlatEntity";
import { RawPayment } from "../grant/@types/rawGrant";
import ProviderValueAdapter from "../../shared/adapters/ProviderValueAdapter";
import PaymentFlatDbo from "../../dataProviders/db/paymentFlat/PaymentFlatDbo";
import Siren from "../../identifierObjects/Siren";
import Siret from "../../identifierObjects/Siret";
import { ChorusPaymentFlatEntity } from "../providers/chorus/@types/ChorusPaymentFlat";
import { FonjepPaymentFlatEntity } from "../providers/fonjep/entities/FonjepFlatEntity";
import FonjepEntityAdapter from "../providers/fonjep/adapters/FonjepEntityAdapter";
import { GenericAdapter } from "../../shared/GenericAdapter";

export default class PaymentFlatAdapter {
    public static rawToPayment(rawPayment: RawPayment) {
        return this.toPayment(rawPayment.data);
    }

    public static toPayment(entity: PaymentFlatEntity): Payment {
        const toPvPaymentFlat = <T>(value: T) =>
            ProviderValueAdapter.toProviderValue<T>(value, entity.provider, entity.operationDate);

        const toPvOrUndefined = value => (value ? toPvPaymentFlat(value) : undefined);

        const basePayment: BasePayment = {
            exerciceBudgetaire: toPvPaymentFlat(entity.budgetaryYear),
            versementKey: toPvPaymentFlat(entity.paymentId),
            siret: toPvPaymentFlat(entity.beneficiaryEstablishmentId.toString()),
            amount: toPvPaymentFlat(entity.amount),
            dateOperation: toPvPaymentFlat(entity.operationDate),
            programme: toPvPaymentFlat(entity.programNumber),
            libelleProgramme: toPvOrUndefined(entity.programName),
        };

        if (entity?.ej && entity.ej !== GenericAdapter.NOT_APPLICABLE_VALUE) {
            // NOTE : actionLabel and activityLabel are defined in FonjepPaymentFlat but not used in Payment
            // this will not be updated because Payment DTO is about to be remove and replaced with PaymentFlat
            const chorusPaymentPart = {
                ej: toPvOrUndefined((entity as ChorusPaymentFlatEntity).ej),
                centreFinancier: toPvOrUndefined(entity.financialCenterLabel),
                domaineFonctionnel: toPvOrUndefined(entity.actionLabel),
                activitee: toPvOrUndefined(entity.activityLabel),
            };
            return { ...basePayment, ...chorusPaymentPart } as ChorusPayment;
        } else
            return {
                ...basePayment,
                codePoste: toPvOrUndefined(FonjepEntityAdapter.extractPositionCode(entity as FonjepPaymentFlatEntity)),
            } as FonjepPayment;
    }

    static toDbo(entity: PaymentFlatEntity): Omit<PaymentFlatDbo, "_id"> {
        return {
            idUnique: entity.uniqueId,
            typeIdEntrepriseBeneficiaire: entity.beneficiaryCompanyIdType,
            idEntrepriseBeneficiaire: entity.beneficiaryCompanyId.value,
            typeIdEtablissementBeneficiaire: entity.beneficiaryEstablishmentIdType,
            idEtablissementBeneficiaire: entity.beneficiaryEstablishmentId.value,
            fournisseur: entity.provider,
            idVersement: entity.paymentId,
            exerciceBudgetaire: entity.budgetaryYear,
            montant: entity.amount,
            dateOperation: entity.operationDate,
            programme: entity.programName,
            numeroProgramme: entity.programNumber,
            mission: entity.mission,
            ministere: entity.ministry,
            sigleMinistere: entity.ministryAcronym,
            ej: entity.ej,
            codeAction: entity.actionCode,
            action: entity.actionLabel,
            codeActivite: entity.activityCode,
            activite: entity.activityLabel,
            codeCentreFinancier: entity.financialCenterCode,
            libelleCentreFinancier: entity.financialCenterLabel,
            attachementComptable: entity.accountingAttachment,
            regionAttachementComptable: entity.accountingAttachmentRegion,
            dateMiseAJour: entity.updateDate,
        };
    }

    // TODO: choose between full english entity and full french entity but not a mix of two
    static dboToEntity(dbo: PaymentFlatDbo): PaymentFlatEntity {
        // ChorusPaymentFlatEntity
        if (dbo.ej) {
            return {
                paymentId: dbo.idVersement,
                uniqueId: dbo.idUnique,
                budgetaryYear: dbo.exerciceBudgetaire,
                beneficiaryEstablishmentIdType: dbo.typeIdEtablissementBeneficiaire,
                beneficiaryEstablishmentId: new Siret(dbo.idEtablissementBeneficiaire),
                beneficiaryCompanyIdType: dbo.typeIdEntrepriseBeneficiaire,
                beneficiaryCompanyId: new Siren(dbo.idEntrepriseBeneficiaire),
                ej: dbo.ej,
                amount: dbo.montant,
                operationDate: dbo.dateOperation,
                financialCenterCode: dbo.codeCentreFinancier,
                financialCenterLabel: dbo.libelleCentreFinancier,
                accountingAttachment: dbo.attachementComptable,
                accountingAttachmentRegion: dbo.regionAttachementComptable,
                mission: dbo.mission,
                programName: dbo.programme,
                programNumber: dbo.numeroProgramme,
                ministry: dbo.ministere,
                ministryAcronym: dbo.sigleMinistere,
                actionCode: dbo.codeAction,
                actionLabel: dbo.action,
                activityCode: dbo.codeActivite,
                activityLabel: dbo.activite,
                provider: dbo.fournisseur,
                updateDate: dbo.dateMiseAJour,
            };
        }
        // FonjepPaymentFlatEntity
        else
            return {
                paymentId: dbo.idVersement,
                uniqueId: dbo.idUnique,
                budgetaryYear: dbo.exerciceBudgetaire,
                beneficiaryEstablishmentIdType: dbo.typeIdEtablissementBeneficiaire,
                beneficiaryEstablishmentId: new Siret(dbo.idEtablissementBeneficiaire),
                beneficiaryCompanyIdType: dbo.typeIdEntrepriseBeneficiaire,
                beneficiaryCompanyId: new Siren(dbo.idEntrepriseBeneficiaire),
                ej: GenericAdapter.NOT_APPLICABLE_VALUE,
                amount: dbo.montant,
                operationDate: dbo.dateOperation,
                financialCenterCode: dbo.codeCentreFinancier,
                financialCenterLabel: dbo.libelleCentreFinancier,
                accountingAttachment: dbo.attachementComptable,
                accountingAttachmentRegion: dbo.regionAttachementComptable,
                mission: dbo.mission,
                programName: dbo.programme,
                programNumber: dbo.numeroProgramme,
                ministry: dbo.ministere,
                ministryAcronym: dbo.sigleMinistere,
                actionCode: dbo.codeAction,
                actionLabel: dbo.action,
                activityCode: dbo.codeActivite,
                activityLabel: dbo.activite,
                provider: dbo.fournisseur,
                updateDate: dbo.dateMiseAJour,
            };
    }

    static toDto(entity: PaymentFlatEntity) {
        return PaymentFlatAdapter.toDbo(entity) as PaymentFlatDto;
    }
}
