import { ChorusPayment, FonjepPayment, Payment } from "dto";
import PaymentFlatEntity from "../../entities/PaymentFlatEntity";
import { RawPayment } from "../grant/@types/rawGrant";
import ProviderValueAdapter from "../../shared/adapters/ProviderValueAdapter";
import PaymentFlatDbo from "../../dataProviders/db/paymentFlat/PaymentFlatDbo";
import Siren from "../../valueObjects/Siren";
import Siret from "../../valueObjects/Siret";
import { ChorusPaymentFlatEntity } from "../providers/chorus/@types/ChorusPaymentFlat";
import { FonjepPaymentFlatEntity } from "../providers/fonjep/entities/FonjepPaymentFlatEntity";

export default class PaymentFlatAdapter {
    public static rawToPayment(rawPayment: RawPayment<PaymentFlatEntity>) {
        return this.toPayment(rawPayment.data);
    }

    public static toPayment(entity: PaymentFlatEntity): Payment {
        const toPvPaymentFlat = <T>(value: T) =>
            ProviderValueAdapter.toProviderValue<T>(value, entity.provider, entity.operationDate);

        const toPvOrUndefined = value => (value ? toPvPaymentFlat(value) : undefined);

        /* Pour l'instant on garde ej pour tous les providers sauf Fonjep qui prend idVersement 
        Il faudra convertir tous les versementKey en idVersement quand tout est connecté  */
        const basePayment = {
            versementKey: toPvOrUndefined(entity.idVersement),
            siret: toPvOrUndefined(entity.idEtablissementBeneficiaire.toString()),
            amount: toPvOrUndefined(entity.amount),
            dateOperation: toPvOrUndefined(entity.operationDate),
            programme: toPvOrUndefined(entity.programNumber),
        };

        if (entity?.ej) {
            const chorusPaymentPart = {
                ej: toPvOrUndefined((entity as ChorusPaymentFlatEntity).ej),
                libelleProgramme: toPvOrUndefined(entity.programName),
                centreFinancier: toPvOrUndefined(entity.centreFinancierLibelle),
                domaineFonctionnel: toPvOrUndefined(entity.actionLabel),
                activitee: toPvOrUndefined(entity.activityLabel),
            };
            return { ...basePayment, ...chorusPaymentPart } as ChorusPayment;
        }
        // TODO: Strange that FONJEP doesn't have any specific field in payment flat except codePoste
        else
            return {
                ...basePayment,
                codePoste: toPvOrUndefined((entity as FonjepPaymentFlatEntity).codePoste),
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
            ej: entity.ej || null,
            codePoste: entity.codePoste || null,
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
                codePoste: null,
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
                // as long as we only have fonjep and chorus as payment providers
                // this else block will always concern FONJEP payment, with a codePoste defined.
                codePoste: dbo.codePoste as string,
                ej: null,
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
