import { ApplicationStatus, DemandeSubvention, ApplicationDto } from "dto";
import ProviderValueFactory from "../../../shared/ProviderValueFactory";
import { sameDateNextYear } from "../../../shared/helpers/DateHelper";
import MiscScdlGrantProducerEntity from "./entities/MiscScdlGrantProducerEntity";
import { ScdlGrantEntity } from "./@types/ScdlGrantEntity";

export default class MiscScdlAdapter {
    public static toDemandeSubvention(entity: MiscScdlGrantProducerEntity): DemandeSubvention {
        const lastUpdateDate = new Date(entity.producer.lastUpdate);
        const toPV = ProviderValueFactory.buildProviderValueAdapter(entity.producer.name, lastUpdateDate);
        const amount = toPV(entity.amount);

        return {
            siret: toPV(entity.associationSiret),
            service_instructeur: toPV(entity.allocatorName),
            actions_proposee: [{ intitule: toPV(entity.object || "") }],
            statut_label: toPV(ApplicationStatus.GRANTED),
            status: toPV(ApplicationStatus.GRANTED), // not given by provider
            montants: {
                accorde: amount,
            },
            date_commision: toPV(entity.conventionDate), // doubt
            financeur_principal: toPV(entity.allocatorName),
            annee_demande: toPV(entity.conventionDate?.getFullYear()), // doubt
            pluriannualite: toPV(MiscScdlAdapter._multiannuality(entity)),
        };
    }

    public static toCommon(entity: ScdlGrantEntity): ApplicationDto {
        return {
            exercice: entity.exercice,
            dispositif: "",
            montant_accorde: entity.amount,
            objet: entity.object || "",
            service_instructeur: entity.allocatorName,
            siret: entity.allocatorSiret,
            statut: ApplicationStatus.GRANTED,
        };
    }

    private static _multiannuality(entity: MiscScdlGrantProducerEntity) {
        if (!entity.paymentEndDate || !entity.paymentStartDate) return "Non";
        const startNextYear = sameDateNextYear(entity.paymentStartDate);
        return entity.paymentEndDate >= startNextYear ? "Oui" : "Non";
    }
}
