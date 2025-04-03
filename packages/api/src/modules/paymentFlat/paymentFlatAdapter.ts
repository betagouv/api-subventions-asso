import { Payment } from "dto";
import PaymentFlatEntity from "../../entities/PaymentFlatEntity";
import { RawPayment } from "../grant/@types/rawGrant";
import ProviderValueAdapter from "../../shared/adapters/ProviderValueAdapter";
import PaymentFlatDbo from "../../dataProviders/db/paymentFlat/PaymentFlatDbo";
import Siren from "../../valueObjects/Siren";
import Siret from "../../valueObjects/Siret";

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
        return {
            versementKey:
                entity.provider === "fonjep" ? toPvPaymentFlat(entity.idVersement) : toPvPaymentFlat(entity.ej),
            siret: toPvPaymentFlat(entity.idEtablissementBeneficiaire.toString()),
            amount: toPvPaymentFlat(entity.amount),
            dateOperation: toPvPaymentFlat(entity.operationDate),
            programme: toPvPaymentFlat(entity.programNumber),
            libelleProgramme: toPvOrUndefined(entity.programName),
            ej: toPvPaymentFlat(entity.ej),
            centreFinancier: toPvOrUndefined(entity.centreFinancierLibelle),
            domaineFonctionnel: toPvOrUndefined(entity.actionLabel),
            activitee: toPvOrUndefined(entity.activityLabel),
        };
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

    static dboToEntity(dbo: PaymentFlatDbo): PaymentFlatEntity {
        /* question: je suis obligé pour comment je crée l'entité de recalculer regionAttachement,
         idVersement and so on. C'est une bonne chose ?
         */
        return new PaymentFlatEntity(
            dbo.exerciceBudgetaire,
            dbo.typeIdEtablissementBeneficiaire,
            // to adapt when we will have typeId != siret
            new Siret(dbo.idEtablissementBeneficiaire),
            dbo.typeIdEntrepriseBeneficiaire,
            new Siren(dbo.idEntrepriseBeneficiaire),
            dbo.montant,
            dbo.dateOperation,
            dbo.codeCentreFinancier,
            dbo.libelleCentreFinancier,
            dbo.attachementComptable,
            dbo.ej,
            dbo.provider,
            dbo.programme,
            dbo.numeroProgramme,
            dbo.mission,
            dbo.ministere,
            dbo.sigleMinistere,
            dbo.codeAction,
            dbo.action,
            dbo.codeActivite,
            dbo.activite,
        );
    }
}
