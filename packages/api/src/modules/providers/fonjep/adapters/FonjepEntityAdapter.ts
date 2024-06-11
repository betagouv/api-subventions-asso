import { ApplicationStatus, DemandeSubvention, Etablissement, FullGrantDto, FonjepPayment } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import FonjepSubventionEntity from "../entities/FonjepSubventionEntity";
import fonjepService from "../fonjep.service";
import FonjepPaymentEntity from "../entities/FonjepPaymentEntity";

export default class FonjepEntityAdapter {
    static PROVIDER_NAME = "Fonjep";

    static toDemandeSubvention(entity: FonjepSubventionEntity): DemandeSubvention {
        const dataDate = entity.indexedInformations.updated_at;
        const toPV = ProviderValueFactory.buildProviderValueAdapter(fonjepService.provider.name, dataDate);
        const getSubventionStatus = () => {
            let status = entity.indexedInformations.status;
            const raison = entity.indexedInformations.raison;
            if (raison) status += ` - ${raison}`;
            return status;
        };

        return {
            siret: toPV(entity.legalInformations.siret),
            versementKey: toPV(entity.indexedInformations.code_poste),
            service_instructeur: toPV(entity.indexedInformations.service_instructeur),
            dispositif: toPV(entity.indexedInformations.dispositif),
            status: toPV(getSubventionStatus()),
            statut_label: toPV(ApplicationStatus.GRANTED),
            pluriannualite: toPV("Oui"),
            plein_temps: toPV(entity.indexedInformations.plein_temps),
            annee_demande: toPV(entity.indexedInformations.annee_demande),
            date_fin: toPV(entity.indexedInformations.date_fin_triennale),
            montants: {
                accorde: toPV(entity.indexedInformations.montant_paye),
                demande: toPV(entity.indexedInformations.montant_paye),
            },
        };
    }

    static toEtablissement(entity: FonjepSubventionEntity): Etablissement {
        const dataDate = entity.indexedInformations.updated_at;
        const toPV = ProviderValueFactory.buildProviderValuesAdapter(fonjepService.provider.name, dataDate);

        return {
            siret: toPV(entity.legalInformations.siret),
            nic: toPV(siretToNIC(entity.legalInformations.siret)),
            adresse: toPV({
                code_postal: entity.indexedInformations.code_postal,
                commune: entity.indexedInformations.ville,
            }),
            contacts: [
                toPV({
                    email: entity.indexedInformations.contact,
                }),
            ],
        };
    }

    static toPayment(entity: FonjepPaymentEntity): FonjepPayment {
        const dataDate = entity.indexedInformations.updated_at;
        const toPV = ProviderValueFactory.buildProviderValueAdapter(fonjepService.provider.name, dataDate);

        return {
            id: entity.indexedInformations.unique_id,
            codePoste: toPV(entity.indexedInformations.code_poste),
            versementKey: toPV(entity.indexedInformations.code_poste),
            siret: toPV(entity.legalInformations.siret),
            amount: toPV(entity.indexedInformations.montant_paye),
            dateOperation: toPV(entity.indexedInformations.date_versement),
            periodeDebut: toPV(entity.indexedInformations.periode_debut),
            periodeFin: toPV(entity.indexedInformations.periode_fin),
            montantAPayer: toPV(entity.indexedInformations.montant_a_payer),
            bop: toPV(entity.indexedInformations.bop),
        };
    }

    static toCommon(entity): FullGrantDto {
        return {
            bop: "", // TODO business logic
            date_debut: entity.indexedInformations.date_versement,
            dispositif: entity.indexedInformations.dispositif,
            exercice: entity.indexedInformations.annee_demande,
            montant_accorde: entity.data.MontantSubvention, // different to previous source
            montant_verse: entity.indexedInformations.montant_paye,
            objet: "",
            service_instructeur: entity.indexedInformations.service_instructeur,
            siret: entity.legalInformations.siret,
            statut: ApplicationStatus.GRANTED,
        };
    }
}
