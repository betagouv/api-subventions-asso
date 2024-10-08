import { ApplicationStatus, DemandeSubvention, CommonApplicationDto } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { sameDateNextYear } from "../../../../shared/helpers/DateHelper";
import MiscScdlGrantProducerEntity from "../entities/MiscScdlGrantProducerEntity";
import { ScdlGrantEntity } from "../@types/ScdlGrantEntity";
import { RawApplication } from "../../../grant/@types/rawGrant";

export default class MiscScdlAdapter {
    public static toDemandeSubvention(entity: MiscScdlGrantProducerEntity): DemandeSubvention {
        const lastUpdateDate = new Date(entity.producer.lastUpdate);
        const toPV = ProviderValueFactory.buildProviderValueAdapter(entity.producer.name, lastUpdateDate);
        const amount = toPV(entity.amount);

        const commisionDate = entity.conventionDate ? toPV(entity.conventionDate) : toPV(new Date(entity.exercice));

        return {
            siret: toPV(entity.associationSiret),
            service_instructeur: toPV(entity.allocatorName),
            actions_proposee: [{ intitule: toPV(entity.object || "") }],
            statut_label: toPV(MiscScdlAdapter._status(entity)),
            status: toPV(MiscScdlAdapter._status(entity)),
            montants: {
                accorde: amount,
            },
            date_commision: commisionDate, // doubt
            financeur_principal: toPV(entity.allocatorName),
            annee_demande: toPV(entity.exercice), // doubt
            pluriannualite: toPV(MiscScdlAdapter._multiannuality(entity)),
        };
    }

    public static toCommon(entity: ScdlGrantEntity): CommonApplicationDto {
        return {
            exercice: entity.exercice,
            dispositif: "",
            montant_accorde: entity.amount,
            objet: entity.object || "",
            service_instructeur: entity.allocatorName,
            siret: entity.allocatorSiret,
            statut: MiscScdlAdapter._status(entity),
        };
    }

    static rawToApplication(rawApplication: RawApplication<MiscScdlGrantProducerEntity>) {
        return this.toDemandeSubvention(rawApplication.data);
    }

    static toRawApplication(entity: MiscScdlGrantProducerEntity) {
        const rawApplication: RawApplication<MiscScdlGrantProducerEntity> = {
            provider: entity.producer.name,
            type: "application",
            data: entity,
        };

        return rawApplication;
    }

    private static _multiannuality(entity: MiscScdlGrantProducerEntity) {
        if (!entity.paymentEndDate || !entity.paymentStartDate) return "Non";
        const startNextYear = sameDateNextYear(entity.paymentStartDate);
        return entity.paymentEndDate >= startNextYear ? "Oui" : "Non";
    }

    private static _status(entity: MiscScdlGrantProducerEntity | ScdlGrantEntity) {
        // not given by provider but this is the rule from Paris
        return entity.amount > 0 ? ApplicationStatus.GRANTED : ApplicationStatus.REFUSED;
    }
}
