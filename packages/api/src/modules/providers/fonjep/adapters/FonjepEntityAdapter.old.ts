import { ApplicationStatus, CommonFullGrantDto, DemandeSubvention, Etablissement, FonjepPayment, Grant } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import FonjepSubventionEntity from "../entities/FonjepSubventionEntity.old";
import fonjepService from "../fonjep.service.old";
import FonjepPaymentEntity from "../entities/FonjepPaymentEntity.old";
import { RawApplication, RawFullGrant, RawPayment } from "../../../grant/@types/rawGrant";
import StateBudgetProgramEntity from "../../../../entities/StateBudgetProgramEntity";

// TO DO DANS LA SUITE : une fois applicationFlat et paymentFlat crées,
// il faudra supprimer les métodes de cette classe qui ne sont plus pertinent

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

    public static rawToGrant(
        rawFullGrant: RawFullGrant<{ application: FonjepSubventionEntity; payments: FonjepPaymentEntity[] }>,
        programs: StateBudgetProgramEntity[],
    ): Grant {
        return {
            application: this.toDemandeSubvention(rawFullGrant.data.application),
            payments: rawFullGrant.data.payments.map((rawPayment, index) =>
                this.toPayment(rawPayment, programs[index]),
            ),
        };
    }

    public static rawToApplication(rawApplication: RawApplication<FonjepSubventionEntity>) {
        return this.toDemandeSubvention(rawApplication.data);
    }

    // TODO: rename FonjepPaymentEntity to FonjepPaymentDbo ?
    public static rawToPayment(rawPayment: RawPayment<FonjepPaymentEntity>, program: StateBudgetProgramEntity) {
        return this.toPayment(rawPayment.data, program);
    }

    static toPayment(entity: FonjepPaymentEntity, program: StateBudgetProgramEntity): FonjepPayment {
        const dataDate = entity.indexedInformations.updated_at;
        const toPV = ProviderValueFactory.buildProviderValueAdapter(fonjepService.provider.name, dataDate);

        return {
            codePoste: toPV(entity.indexedInformations.code_poste),
            versementKey: toPV(entity.indexedInformations.code_poste),
            siret: toPV(entity.legalInformations.siret),
            amount: toPV(entity.indexedInformations.montant_paye),
            dateOperation: toPV(entity.indexedInformations.date_versement),
            periodeDebut: toPV(entity.indexedInformations.periode_debut),
            periodeFin: toPV(entity.indexedInformations.periode_fin),
            montantAPayer: toPV(entity.indexedInformations.montant_a_payer),
            programme: toPV(program.code_programme),
            libelleProgramme: toPV(program.label_programme),
            bop: toPV(program.code_programme), // deprecated
        };
    }

    static toCommon(entity): CommonFullGrantDto {
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
