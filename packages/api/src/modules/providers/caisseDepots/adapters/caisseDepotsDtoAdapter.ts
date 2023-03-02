import { DemandeSubvention } from "@api-subventions-asso/dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import caisseDepotsService from "../caisseDepots.service";
import CaisseDepotsSubventionDto from "../dto/CaisseDepotsSubventionDto";

export default class CaisseDepotsDtoAdapter {
    private static _multiannuality(dto: CaisseDepotsSubventionDto): "Oui" | "Non" {
        if (dto.fields.conditionsversement === "UNIQUE") return "Non";
        if (!dto.fields.datesversement_fin || !dto.fields.datesversement_debut) return "Non";
        const start = new Date(dto.fields.datesversement_debut);
        const end = new Date(dto.fields.datesversement_fin);
        const startNextYear = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
        if (end > startNextYear) return "Oui";
        return "Non";
    }

    public static toDemandeSubvention(dto: CaisseDepotsSubventionDto): DemandeSubvention {
        const lastUpdateDate = new Date(dto.timestamp);
        const toPV = ProviderValueFactory.buildProviderValueAdapter(caisseDepotsService.provider.name, lastUpdateDate);
        const amount = toPV(dto.fields.montant);

        return {
            siret: toPV(dto.fields.idbeneficiare),
            service_instructeur: toPV(dto.fields.nomattribuant),
            actions_proposee: [{ intitule: toPV(dto.fields.objet) }],
            status: toPV("Attribuée"),
            montants: {
                accorde: amount
            },
            date_commision: toPV(new Date(dto.fields.dateconvention)), // doubt
            financeur_principal: toPV(dto.fields.nomattribuant),
            annee_demande: toPV(new Date(dto.fields.dateconvention).getFullYear()), // doubt
            pluriannualite: toPV(this._multiannuality(dto)),
            versementKey: toPV(dto.id)
        };
    }
}
