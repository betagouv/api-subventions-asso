import { DemandeSubvention } from "dto";
import { WithId } from "mongodb";
import { ApplicationFlatEntity } from "../../entities/ApplicationFlatEntity";
import { RawApplication } from "../grant/@types/rawGrant";
import ProviderValueAdapter from "../../shared/adapters/ProviderValueAdapter";
import applicationFlatService from "./applicationFlat.service";

// entities and draft are almost equal but we want ids to be built in constructor
// and we want to be able to build with a properly types object
type ApplicationFlatEntityDraft = Omit<ApplicationFlatEntity, "idUnique" | "idSubvention">;

export default class ApplicationFlatAdapter {
    public static rawToApplication(rawApplication: RawApplication<ApplicationFlatEntity>) {
        return this.toDemandeSubvention(rawApplication.data);
    }

    public static buildEntity(draft: ApplicationFlatEntityDraft): ApplicationFlatEntity {
        return {
            ...draft,
            idSubvention: `${draft.provider}--${draft.idSubventionProvider}`,
            idUnique: `${draft.provider}--${draft.idSubventionProvider}}--${draft.exerciceBudgetaire}`,
        };
    }

    public static dboToEntity(dbo: WithId<ApplicationFlatEntity>) {
        const { _id, ...entity } = dbo;
        return entity;
    }

    public static toDemandeSubvention(entity: ApplicationFlatEntity): DemandeSubvention | null {
        const siret = applicationFlatService.getSiret(entity);
        if (!siret) return null;

        const toPv = <T>(value: T) =>
            ProviderValueAdapter.toProviderValue<T>(value, entity.provider, entity.dateConvention); // TODO bad date

        const toPvOrUndefined = value => (value ? toPv(value) : undefined);

        /* Pour l'instant on garde ej pour tous les providers sauf Fonjep qui prend idVersement 
        Il faudra convertir tous les versementKey en idVersement quand tout est connecté  */
        return {
            annee_demande: toPvOrUndefined(entity.anneeDemande),
            date_commision: toPvOrUndefined(entity.dateDecision), // TODO surely not good
            pluriannualite: toPvOrUndefined(entity.pluriannualite),
            service_instructeur: toPv(entity.nomServiceInstructeur || ""),
            siret: toPv(siret.value),
            sous_dispositif: toPvOrUndefined(entity.sousDispositif),
            status: toPv(entity.statutLabel || ""),
            statut_label: toPv(entity.statutLabel),
            transmis_le: toPvOrUndefined(entity.dateDepotDemande),
            versementKey: toPvOrUndefined(entity.idVersement),
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
                    : [{ intitule: toPv(entity.objet) }],
            co_financement: {
                cofinanceur: toPv(entity.nomsAttribuantsCofinanceurs?.join(", ") || ""),
                cofinanceur_email: toPv(""),
                montants: toPv(0), // TODO fake data but we won't know
            },
        };
    }
}
