import { WithId } from "mongodb";
import { PaymentDto, ChorusPayment } from "dto";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import ChorusLineEntity from "../entities/ChorusLineEntity";

export default class ChorusAdapter {
    static PROVIDER_NAME = "Chorus";

    public static toPayment(entity: WithId<ChorusLineEntity>): ChorusPayment {
        const toPv = value =>
            ProviderValueAdapter.toProviderValue(
                value,
                ChorusAdapter.PROVIDER_NAME,
                entity.indexedInformations.dateOperation,
            );
        const toPvOrUndefined = value => (value ? toPv(value) : undefined);
        return {
            id: entity._id.toString(),
            ej: toPv(entity.indexedInformations.ej),
            versementKey: toPv(entity.indexedInformations.ej),
            siret: toPv(entity.indexedInformations.siret),
            amount: toPv(entity.indexedInformations.amount),
            dateOperation: toPv(entity.indexedInformations.dateOperation),
            centreFinancier: toPv(entity.indexedInformations.centreFinancier),
            domaineFonctionnel: toPv(entity.indexedInformations.domaineFonctionnel),
            codeBranche: toPv(entity.indexedInformations.codeBranche),
            branche: toPv(entity.indexedInformations.branche),
            numeroDemandePayment: toPvOrUndefined(entity.indexedInformations.numeroDemandePayment),
            numeroTier: toPvOrUndefined(entity.indexedInformations.numeroTier),
            activitee: toPvOrUndefined(entity.indexedInformations.activitee),
            compte: toPvOrUndefined(entity.indexedInformations.compte),
            type: toPvOrUndefined(entity.indexedInformations.typeOperation),
            bop: toPv(entity.indexedInformations.codeDomaineFonctionnel.slice(0, 4)),
        };
    }

    public static toCommon(entity: ChorusLineEntity): PaymentDto {
        const bop = entity.indexedInformations.codeDomaineFonctionnel.slice(0, 4);
        return {
            montant_verse: entity.indexedInformations.amount,
            date_debut: entity.indexedInformations.dateOperation,
            bop: bop,
            exercice: entity.indexedInformations.dateOperation.getFullYear(),
        };
    }
}
