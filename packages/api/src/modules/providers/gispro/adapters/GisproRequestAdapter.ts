import { ApplicationStatus, DemandeSubvention } from "@api-subventions-asso/dto";
import GisproActionEntity from "../entities/GisproActionEntity";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";

export default class GisproRequestAdapter {
    static PROVIDER_NAME = "Gispro";

    public static toDemandeSubvention(entities: GisproActionEntity[]): DemandeSubvention {
        const dataDate = entities[0].providerInformations.importedDate;

        const toPV = ProviderValueFactory.buildProviderValueAdapter(GisproRequestAdapter.PROVIDER_NAME, dataDate);
        return {
            siret: toPV(entities[0].providerInformations.siret),
            service_instructeur: toPV(entities[0].providerInformations.direction),
            status: toPV("Non communiqué par GISPRO"),
            montants: {
                accorde: toPV(entities.reduce((total, entity) => total + entity.providerInformations.montant, 0))
            },
            actions_proposee: entities.map(entity => ({
                intitule: toPV(entity.providerInformations.action),
                montants_versement: {
                    accorde: toPV(entity.providerInformations.montant)
                }
            }))
        };
    }
}
