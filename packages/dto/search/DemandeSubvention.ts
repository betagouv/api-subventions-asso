import { SiretDto } from "..";
import { ProviderValue } from "../shared/ProviderValue";
import { Payment } from "../payments";

export enum ApplicationStatus {
    PENDING = "En instruction",
    INELIGIBLE = "Inéligible",
    GRANTED = "Accordé",
    REFUSED = "Refusé",
    UNKNWON = "",
}

export interface DemandeSubvention {
    service_instructeur: ProviderValue<string>;
    siret: ProviderValue<SiretDto>;
    dispositif?: ProviderValue<string>;
    sous_dispositif?: ProviderValue<string>;
    ej?: ProviderValue<string>;
    versementKey?: ProviderValue<string>;
    annee_demande?: ProviderValue<number>;
    date_commision?: ProviderValue<Date>;
    financeur_principal?: ProviderValue<string>;
    creer_le?: ProviderValue<Date>;
    transmis_le?: ProviderValue<Date>;
    date_fin?: ProviderValue<Date>;
    pluriannualite?: ProviderValue<string>;
    plein_temps?: ProviderValue<string>;
    contact?: {
        email: ProviderValue<string>;
        telephone?: ProviderValue<string>;
    };
    statut_label: ProviderValue<ApplicationStatus>;
    status: ProviderValue<string>;
    montants?: {
        total?: ProviderValue<number>;
        demande?: ProviderValue<number>;
        propose?: ProviderValue<number>;
        accorde?: ProviderValue<number>;
    };
    versement?: {
        acompte: ProviderValue<number>;
        solde: ProviderValue<number>;
        realise: ProviderValue<number>;
        compensation: {
            "n-1": ProviderValue<number>;
            reversement: ProviderValue<number>;
        };
    };
    actions_proposee?: {
        ej?: ProviderValue<string>;
        rang?: ProviderValue<number>;
        intitule: ProviderValue<string>;
        objectifs?: ProviderValue<string>;
        objectifs_operationnels?: ProviderValue<string>;
        description?: ProviderValue<string>;
        nature_aide?: ProviderValue<string>;
        modalite_aide?: ProviderValue<string>;
        modalite_ou_dispositif?: ProviderValue<string>;
        indicateurs?: ProviderValue<string>;
        cofinanceurs?: {
            noms: ProviderValue<string>;
            montant_demandes: ProviderValue<number>;
        };
        montants_versement?: {
            total?: ProviderValue<number>;
            demande?: ProviderValue<number>;
            propose?: ProviderValue<number>;
            accorde?: ProviderValue<number>;
            attribue?: ProviderValue<number>;
            realise?: ProviderValue<number>;
            compensation?: ProviderValue<number>;
        };
    }[];
    co_financement?: {
        cofinanceur: ProviderValue<string>;
        cofinanceur_email: ProviderValue<string>;
        cofinanceur_siret?: ProviderValue<string>;
        montants: ProviderValue<number>;
    };
    territoires?: {
        status: ProviderValue<string>;
        commentaire: ProviderValue<string>;
    }[];
    versements?: Payment[];
    evaluation?: {
        evaluation_resultat: ProviderValue<string>;
        cout_total_realise: ProviderValue<number>;
    };
}
