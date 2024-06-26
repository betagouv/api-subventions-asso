import { WithId } from "mongodb";
import { PaymentDto, ChorusPayment } from "dto";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import ChorusLineEntity from "../entities/ChorusLineEntity";
import StateBudgetProgramEntity from "../../../../entities/StateBudgetProgramEntity";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";

export default class ChorusAdapter {
    static PROVIDER_NAME = "Chorus";

    public static toPayment(entity: WithId<ChorusLineEntity>, program: StateBudgetProgramEntity): ChorusPayment {
        const toPvChorus = <T>(value: T) =>
            ProviderValueAdapter.toProviderValue<T>(
                value,
                ChorusAdapter.PROVIDER_NAME,
                entity.indexedInformations.dateOperation,
            );

        const toPvDataBretagne = <T>(value: T) =>
            ProviderValueAdapter.toProviderValue<T>(
                value,
                dataBretagneService.provider.name,
                entity.indexedInformations.dateOperation,
            );

        const toPvOrUndefined = value => (value ? toPvChorus(value) : undefined);
        return {
            id: entity._id.toString(),
            ej: toPvChorus(entity.indexedInformations.ej),
            versementKey: toPvChorus(entity.indexedInformations.ej),
            siret: toPvChorus(entity.indexedInformations.siret),
            amount: toPvChorus(entity.indexedInformations.amount),
            dateOperation: toPvChorus(entity.indexedInformations.dateOperation),
            centreFinancier: toPvChorus(entity.indexedInformations.centreFinancier),
            domaineFonctionnel: toPvChorus(entity.indexedInformations.domaineFonctionnel),
            codeBranche: toPvChorus(entity.indexedInformations.codeBranche),
            branche: toPvChorus(entity.indexedInformations.branche),
            numeroDemandePayment: toPvOrUndefined(entity.indexedInformations.numeroDemandePayment),
            numeroTier: toPvOrUndefined(entity.indexedInformations.numeroTier),
            activitee: toPvOrUndefined(entity.indexedInformations.activitee),
            compte: toPvOrUndefined(entity.indexedInformations.compte),
            type: toPvOrUndefined(entity.indexedInformations.typeOperation),
            programme: toPvDataBretagne(program.code_programme),
            libelleProgramme: toPvDataBretagne(program.label_programme),
            bop: toPvChorus(program.code_programme.toString()), // Deprecated
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
