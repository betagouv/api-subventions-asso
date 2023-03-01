import { DemandeSubvention } from "@api-subventions-asso/dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import caisseDepotsService from "../caisseDepots.service";
import CaisseDepotsSubventionDto from "../dto/CaisseDepotsSubventionDto";

export default class CaisseDepotsDtoAdapter {
    public static toDemandeSubvention(dto: CaisseDepotsSubventionDto): DemandeSubvention {
        const lastUpdateDate = new Date(dto.timestamp);
        const toPV = ProviderValueFactory.buildProviderValueAdapter(caisseDepotsService.provider.name, lastUpdateDate);
        const amount = toPV(dto.fields.montant);

        return {
            siret: toPV(dto.fields.idbeneficiare),
            service_instructeur: toPV(dto.fields.nomattribuant),
            dispositif: toPV(dto.fields.objet), // or do action
            status: toPV("Attribuée"),
            montants: {
                accorde: amount,
                demande: amount // doubt
            },
            date_commision: toPV(new Date(dto.fields.dateconvention)), // doubt
            financeur_principal: toPV(dto.fields.nomattribuant),
            annee_demande: toPV(new Date(dto.fields.dateconvention).getFullYear()) // doubt
        };
    }
}
