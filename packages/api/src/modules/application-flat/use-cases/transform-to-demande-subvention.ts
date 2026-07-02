import { DemandeSubvention } from "dto";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import { GenericAdapter } from "../../../shared/GenericAdapter";
import ProviderValueMapper from "../../../shared/mappers/provider-value.mapper";
import { Siret } from "../../../identifier-objects";

export class TransformToDemandeSubvention {
    execute(entity: ApplicationFlatEntity) {
        if (!(entity.beneficiaryEstablishmentId instanceof Siret)) return null;

        const toPv = <T>(value: T) => ProviderValueMapper.toProviderValue<T>(value, entity.provider, entity.updateDate);

        const toPvOrUndefined = value => (value ? toPv(value) : undefined);

        return {
            annee_demande: toPvOrUndefined(entity.budgetaryYear),
            date_commision: toPvOrUndefined(entity.decisionDate), // TODO surely not good
            pluriannualite: toPvOrUndefined(entity.pluriannual),
            service_instructeur: toPv(entity.instructiveDepartmentName || ""),
            siret: toPv(entity.beneficiaryEstablishmentId.toString()),
            sous_dispositif: toPvOrUndefined(entity.subScheme),
            status: toPv(entity.statusLabel || ""),
            statut_label: toPv(entity.statusLabel),
            transmis_le: toPvOrUndefined(entity.depositDate),
            versementKey: toPvOrUndefined(entity.paymentId),
            ej: toPvOrUndefined(entity.ej),
            creer_le: toPvOrUndefined(entity.depositDate),
            dispositif: toPvOrUndefined(entity.scheme),
            montants: {
                total: toPvOrUndefined(entity.totalAmount),
                demande: toPvOrUndefined(entity.requestedAmount),
                accorde: toPvOrUndefined(entity.grantedAmount),
            },
            financeur_principal: toPvOrUndefined(entity.allocatorName),
            actions_proposee:
                entity.object === "Fonctionnement global" || entity.object == undefined
                    ? undefined
                    : [{ intitule: toPv(entity.object) }],
            co_financement: {
                cofinanceur: toPv(
                    entity.cofinancersNames === GenericAdapter.NOT_APPLICABLE_VALUE
                        ? GenericAdapter.NOT_APPLICABLE_VALUE
                        : entity.cofinancersNames?.join("|") || "",
                ),
                cofinanceur_email: toPv(""),
                montants: toPv(0), // TODO make montants optional ?
            },
        } as DemandeSubvention;
    }
}

const transformToDemandeSubvention = new TransformToDemandeSubvention();
export default transformToDemandeSubvention;
