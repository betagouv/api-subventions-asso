import { ChorusPayment, FonjepPayment, Payment } from "dto";
import PaymentFlatEntity from "../../entities/PaymentFlatEntity";
import { RawPayment } from "../grant/@types/rawGrant";
import ProviderValueAdapter from "../../shared/adapters/ProviderValueAdapter";
import PaymentFlatDbo from "../../dataProviders/db/paymentFlat/PaymentFlatDbo";
import Siren from "../../valueObjects/Siren";
import Siret from "../../valueObjects/Siret";
import { ChorusPaymentFlatEntity } from "../providers/chorus/@types/ChorusPaymentFlat";
import { FonjepPaymentFlatEntity } from "../providers/fonjep/entities/FonjepPaymentFlatEntity";
import FonjepEntityAdapter from "../providers/fonjep/adapters/FonjepEntityAdapter";
import { GenericAdapter } from "../../shared/GenericAdapter";

export default class PaymentFlatAdapter {
    public static rawToPayment(rawPayment: RawPayment<PaymentFlatEntity>) {
        return this.toPayment(rawPayment.data);
    }

    public static toPayment(entity: PaymentFlatEntity): Payment {
        const toPvPaymentFlat = <T>(value: T) =>
            ProviderValueAdapter.toProviderValue<T>(value, entity.provider, entity.operationDate);

        const toPvOrUndefined = value => (value ? toPvPaymentFlat(value) : undefined);

        const basePayment = {
            /* Pour l'instant on garde ej pour tous les providers sauf Fonjep qui prend idVersement
            Il faudra convertir tous les versementKey en idVersement quand tout est connecté  */
            versementKey:
                entity.provider === "fonjep" ? toPvPaymentFlat(entity.idVersement) : toPvPaymentFlat(entity.ej),
            siret: toPvOrUndefined(entity.idEtablissementBeneficiaire.toString()),
            amount: toPvOrUndefined(entity.amount),
            dateOperation: toPvOrUndefined(entity.operationDate),
            programme: toPvOrUndefined(entity.programNumber),
            libelleProgramme: toPvOrUndefined(entity.programName),
        };

        if (entity?.ej && entity.ej !== GenericAdapter.NOT_APPLICABLE_VALUE) {
            // NOTE : actionLabel and activityLabel are defined in FonjepPaymentFlat but not used in Payment
            // this will not be updated because Payment DTO is about to be remove and replaced with PaymentFlat
            const chorusPaymentPart = {
                ej: toPvOrUndefined((entity as ChorusPaymentFlatEntity).ej),
                centreFinancier: toPvOrUndefined(entity.centreFinancierLibelle),
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
            typeIdEntrepriseBeneficiaire: entity.typeIdEntrepriseBeneficiaire,
            idEntrepriseBeneficiaire: entity.idEntrepriseBeneficiaire.value,
            typeIdEtablissementBeneficiaire: entity.typeIdEtablissementBeneficiaire,
            idEtablissementBeneficiaire: entity.idEtablissementBeneficiaire.value,
            uniqueId: entity.uniqueId,
            idVersement: entity.idVersement,
            exerciceBudgetaire: entity.exerciceBudgetaire,
            montant: entity.amount,
            dateOperation: entity.operationDate,
            programme: entity.programName,
            numeroProgramme: entity.programNumber,
            mission: entity.mission,
            ministere: entity.ministry,
            sigleMinistere: entity.ministryAcronym,
            ej: entity.ej,
            provider: entity.provider,
            codeAction: entity.actionCode,
            action: entity.actionLabel,
            codeActivite: entity.activityCode,
            activite: entity.activityLabel,
            codeCentreFinancier: entity.centreFinancierCode,
            libelleCentreFinancier: entity.centreFinancierLibelle,
            attachementComptable: entity.attachementComptable,
            regionAttachementComptable: entity.regionAttachementComptable,
        };
    }

    // TODO: choose between full english entity and full french entity but not a mix of two
    static dboToEntity(dbo: PaymentFlatDbo): PaymentFlatEntity {
        // ChorusPaymentFlatEntity
        if (dbo.ej) {
            return {
                idVersement: dbo.idVersement,
                uniqueId: dbo.uniqueId,
                exerciceBudgetaire: dbo.exerciceBudgetaire,
                typeIdEtablissementBeneficiaire: dbo.typeIdEtablissementBeneficiaire,
                idEtablissementBeneficiaire: new Siret(dbo.idEtablissementBeneficiaire),
                typeIdEntrepriseBeneficiaire: dbo.typeIdEntrepriseBeneficiaire,
                idEntrepriseBeneficiaire: new Siren(dbo.idEntrepriseBeneficiaire),
                ej: dbo.ej,
                amount: dbo.montant,
                operationDate: dbo.dateOperation,
                centreFinancierCode: dbo.codeCentreFinancier,
                centreFinancierLibelle: dbo.libelleCentreFinancier,
                attachementComptable: dbo.attachementComptable,
                regionAttachementComptable: dbo.regionAttachementComptable,
                mission: dbo.mission,
                programName: dbo.programme,
                programNumber: dbo.numeroProgramme,
                ministry: dbo.ministere,
                ministryAcronym: dbo.sigleMinistere,
                actionCode: dbo.codeAction,
                actionLabel: dbo.action,
                activityCode: dbo.codeActivite,
                activityLabel: dbo.activite,
                provider: dbo.provider,
            };
        }
        // FonjepPaymentFlatEntity
        else
            return {
                idVersement: dbo.idVersement,
                uniqueId: dbo.uniqueId,
                exerciceBudgetaire: dbo.exerciceBudgetaire,
                typeIdEtablissementBeneficiaire: dbo.typeIdEtablissementBeneficiaire,
                idEtablissementBeneficiaire: new Siret(dbo.idEtablissementBeneficiaire),
                typeIdEntrepriseBeneficiaire: dbo.typeIdEntrepriseBeneficiaire,
                idEntrepriseBeneficiaire: new Siren(dbo.idEntrepriseBeneficiaire),
                ej: GenericAdapter.NOT_APPLICABLE_VALUE,
                amount: dbo.montant,
                operationDate: dbo.dateOperation,
                centreFinancierCode: dbo.codeCentreFinancier,
                centreFinancierLibelle: dbo.libelleCentreFinancier,
                attachementComptable: dbo.attachementComptable,
                regionAttachementComptable: dbo.regionAttachementComptable,
                mission: dbo.mission,
                programName: dbo.programme,
                programNumber: dbo.numeroProgramme,
                ministry: dbo.ministere,
                ministryAcronym: dbo.sigleMinistere,
                actionCode: dbo.codeAction,
                actionLabel: dbo.action,
                activityCode: dbo.codeActivite,
                activityLabel: dbo.activite,
                provider: dbo.provider,
            };
    }
}
