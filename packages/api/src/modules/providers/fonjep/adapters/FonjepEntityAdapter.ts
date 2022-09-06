import { DemandeSubvention, Etablissement } from "@api-subventions-asso/dto";
import ProviderValueFactory from '../../../../shared/ProviderValueFactory';
import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import FonjepSubventionEntity from "../entities/FonjepSubventionEntity";
import fonjepService from "../fonjep.service";

export default class FonjepEntityAdapter {
    static PROVIDER_NAME = "Fonjep"

    static toDemandeSubvention(entity: FonjepSubventionEntity): DemandeSubvention {
        const dataDate = entity.indexedInformations.updated_at;
        const toPV = ProviderValueFactory.buildProviderValueAdapter(fonjepService.provider.name, new Date(dataDate));
        return {
            siret: toPV(entity.legalInformations.siret),
            versementKey: toPV(entity.indexedInformations.code_poste),
            service_instructeur: toPV(entity.indexedInformations.service_instructeur),
            dispositif: toPV(entity.indexedInformations.dispositif),
            status: toPV(entity.indexedInformations.status),
            pluriannualite: toPV("Oui"),
            plein_temps: toPV(entity.indexedInformations.plein_temps),
            annee_demande: toPV(entity.indexedInformations.annee_demande),
            date_fin: toPV(entity.indexedInformations.date_fin_triennale),
            montants: {
                accorde: toPV(entity.indexedInformations.montant_paye),
                demande: toPV(entity.indexedInformations.montant_paye),
            }
        }
    }

    static toEtablissement(entity: FonjepSubventionEntity): Etablissement {
        const dataDate = entity.indexedInformations.updated_at;
        const toProviderValues = ProviderValueFactory.buildProviderValuesAdapter(this.PROVIDER_NAME, dataDate);

        return {
            siret: toProviderValues(entity.legalInformations.siret),
            nic: toProviderValues(siretToNIC(entity.legalInformations.siret)),
            adresse: toProviderValues({
                code_postal: entity.indexedInformations.code_postal,
                commune: entity.indexedInformations.ville
            }),
            contacts: [
                toProviderValues({
                    email: entity.indexedInformations.contact
                })
            ],
        }
    }
}