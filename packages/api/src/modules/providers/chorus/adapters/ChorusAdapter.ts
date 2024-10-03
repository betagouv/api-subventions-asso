import { CommonPaymentDto, ChorusPayment } from "dto";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import ChorusLineEntity from "../entities/ChorusLineEntity";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";
import { RawPayment } from "../../../grant/@types/rawGrant";
import StateBudgetProgramDbo from "../../../../dataProviders/db/state-budget-program/StateBudgetProgramDbo";

export default class ChorusAdapter {
    static PROVIDER_NAME = "Chorus";

    public static rawToPayment(rawPayment: RawPayment<ChorusLineEntity>, program: Omit<StateBudgetProgramDbo, "_id">) {
        return this.toPayment(rawPayment.data, program);
    }

    public static toPayment(entity: ChorusLineEntity, program: Omit<StateBudgetProgramDbo, "_id">): ChorusPayment {
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
            ej: toPvChorus(entity.indexedInformations.ej),
            versementKey: toPvChorus(entity.indexedInformations.ej),
            siret: toPvChorus(entity.indexedInformations.siret),
            amount: toPvChorus(entity.indexedInformations.amount),
            dateOperation: toPvChorus(entity.indexedInformations.dateOperation),
            centreFinancier: toPvChorus(entity.indexedInformations.centreFinancier),
            domaineFonctionnel: toPvChorus(entity.indexedInformations.domaineFonctionnel),
            codeBranche: toPvChorus(entity.indexedInformations.codeBranche),
            branche: toPvChorus(entity.indexedInformations.branche),
            numeroDemandePaiement: toPvOrUndefined(entity.indexedInformations.numeroDemandePaiement),
            numeroTier: toPvOrUndefined(entity.indexedInformations.numeroTier),
            activitee: toPvOrUndefined(entity.indexedInformations.activitee),
            compte: toPvOrUndefined(entity.indexedInformations.compte),
            type: toPvOrUndefined(entity.indexedInformations.typeOperation),
            programme: toPvDataBretagne(program.code_programme),
            libelleProgramme: toPvDataBretagne(program.label_programme),
            bop: toPvChorus(program.code_programme.toString()), // Deprecated
        };
    }

    public static toCommon(entity: ChorusLineEntity): CommonPaymentDto {
        const bop = entity.indexedInformations.codeDomaineFonctionnel.slice(0, 4);
        return {
            montant_verse: entity.indexedInformations.amount,
            date_debut: entity.indexedInformations.dateOperation,
            bop: bop,
            exercice: entity.indexedInformations.exercice,
        };
    }
}
