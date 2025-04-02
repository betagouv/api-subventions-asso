import { DemandeSubvention } from "dto";
import ApplicationFlatEntity from "../../entities/ApplicationFlatEntity";
import { RawApplication } from "../grant/@types/rawGrant";
import ProviderValueAdapter from "../../shared/adapters/ProviderValueAdapter";

export default class ApplicationFlatAdapter {
    public static rawToApplication(rawApplication: RawApplication<ApplicationFlatEntity>) {
        return this.toApplication(rawApplication.data);
    }

    public static toApplication(entity: ApplicationFlatEntity): DemandeSubvention {
        const toPvApplicationFlat = <T>(value: T) =>
            ProviderValueAdapter.toProviderValue<T>(value, entity.provider, entity.dateConvention); // TODO bad date

        const toPvOrUndefined = value => (value ? toPvApplicationFlat(value) : undefined);

        /* Pour l'instant on garde ej pour tous les providers sauf Fonjep qui prend idVersement 
        Il faudra convertir tous les versementKey en idVersement quand tout est connecté  */
        return {
            annee_demande: toPvOrUndefined(entity.anneeDemande),
            date_commision: toPvOrUndefined(entity.dateDecision), // TODO surely not good
            pluriannualite: toPvOrUndefined(entity.pluriannualite),
            service_instructeur: toPvApplicationFlat(entity.nomServiceInstructeur),
            siret: toPvApplicationFlat(entity.idBeneficiaire), // TODO transform to ensure siret if possible
            sous_dispositif: toPvOrUndefined(entity.sousDispositif),
            status: toPvApplicationFlat(entity.statutLabel),
            statut_label: toPvApplicationFlat(entity.statutLabel),
            transmis_le: toPvOrUndefined(entity.dateDepotDemande),
            versementKey: toPvOrUndefined(entity.idVersement), // TODO check
            ej: toPvOrUndefined(entity.ej),
            creer_le: toPvOrUndefined(entity.dateDepotDemande),
            dispositif: toPvOrUndefined(entity.dispositif),
            montants: {
                total: toPvOrUndefined(entity.montantTotal),
                demande: toPvOrUndefined(entity.montantDemande),
                accorde: toPvOrUndefined(entity.montantAccorde),
            },
            financeur_principal: toPvOrUndefined(entity.nomAttribuant), // TODO
            actions_proposee:
                entity.objet === "Fonctionnement global" || entity.objet == undefined
                    ? undefined
                    : [{ intitule: toPvApplicationFlat(entity.objet) }],
            co_financement: {
                cofinanceur: toPvApplicationFlat(entity.nomsAttribuantsCofinanceurs.join(", ")),
                cofinanceur_email: toPvApplicationFlat(""),
                montants: toPvApplicationFlat(0),
            },
        };
    }
}
