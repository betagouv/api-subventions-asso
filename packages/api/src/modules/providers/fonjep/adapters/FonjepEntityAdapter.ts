import { DemandeSubvention, Etablissement, VersementFonjep } from "@api-subventions-asso/dto";
import ProviderValueFactory from '../../../../shared/ProviderValueFactory';
import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import FonjepSubventionEntity from "../entities/FonjepSubventionEntity";
import fonjepService from "../fonjep.service";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";

export default class FonjepEntityAdapter {
    static PROVIDER_NAME = "Fonjep"

    static toDemandeSubvention(entity: FonjepSubventionEntity): DemandeSubvention {
        const dataDate = entity.indexedInformations.updated_at;
        const toPV = ProviderValueFactory.buildProviderValueAdapter(fonjepService.provider.name, dataDate);
        return {
            siret: toPV(entity.legalInformations.siret),
            versementKey: toPV(entity.indexedInformations.code_poste),
            service_instructeur: toPV(entity.indexedInformations.service_instructeur),
            dispositif: toPV(entity.indexedInformations.dispositif),
            status: toPV(entity.indexedInformations.status),
            raison: toPV(entity.indexedInformations.raison),
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
        const toPV = ProviderValueFactory.buildProviderValuesAdapter(fonjepService.provider.name, dataDate);

        return {
            siret: toPV(entity.legalInformations.siret),
            nic: toPV(siretToNIC(entity.legalInformations.siret)),
            adresse: toPV({
                code_postal: entity.indexedInformations.code_postal,
                commune: entity.indexedInformations.ville
            }),
            contacts: [
                toPV({
                    email: entity.indexedInformations.contact
                })
            ],
        }
    }

    static toVersement(entity: FonjepVersementEntity): VersementFonjep {
        const dataDate = entity.indexedInformations.updated_at;
        const toPV = ProviderValueFactory.buildProviderValueAdapter(fonjepService.provider.name, dataDate)

        return {
            id: entity.indexedInformations.unique_id,
            codePoste: toPV(entity.indexedInformations.code_poste),
            versementKey: toPV(entity.indexedInformations.code_poste),
            siret: toPV(entity.legalInformations.siret),
            amount: toPV(entity.indexedInformations.montant_paye),
            dateOperation: toPV(entity.indexedInformations.date_versement),
            periodeDebut: toPV(entity.indexedInformations.periode_debut),
            periodeFin: toPV(entity.indexedInformations.periode_fin),
            montantAPayer: toPV(entity.indexedInformations.montant_a_payer)
        }
    }
}