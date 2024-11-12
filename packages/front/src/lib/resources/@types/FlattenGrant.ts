import { ApplicationStatus, SiretDto } from "dto";

export type OnlyApplication = {
    application: FlatApplication;
    payments: null;
};

export type OnlyPayments = {
    application: null;
    payments: FlatPayment[];
};

export type ApplicationWithPayments = {
    application: FlatApplication;
    payments: FlatPayment[];
};

export type FlatGrant = OnlyApplication | OnlyPayments | ApplicationWithPayments;

export type FlatPayment = FlatChorusPayment | FlatFonjepPayment;

interface FlatBasePayment {
    versementKey: string;
    siret: SiretDto;
    amount: number;
    dateOperation: string;
    programme: number;
    libelleProgramme: string;
}

interface FlatChorusPayment extends FlatBasePayment {
    ej: string;
    centreFinancier: string;
    domaineFonctionnel: string;
    numeroDemandePaiement?: string;
    numeroTier?: string;
    activitee?: string;
    compte?: string;
    codeBranche?: string;
    branche?: string;
    type?: string;
    /**
     * Deprecated
     */
    bop: string;
}

interface FlatFonjepPayment extends FlatBasePayment {
    codePoste: string;
    periodeDebut: string;
    periodeFin: string;
    montantAPayer: number;
    /**
     * Deprecated
     */
    bop: number;
}

export interface FlatApplication {
    service_instructeur: string;
    siret: SiretDto;
    dispositif?: string;
    sous_dispositif?: string;
    ej?: string;
    versementKey?: string;
    annee_demande?: number;
    date_commision?: string;
    financeur_principal?: string;
    creer_le?: string;
    transmis_le?: string;
    date_fin?: string;
    pluriannualite?: string;
    plein_temps?: string;
    contact?: {
        email: string;
        telephone?: string;
    };
    statut_label: ApplicationStatus;
    status: string;
    montants?: {
        total?: number;
        demande?: number;
        propose?: number;
        accorde?: number;
    };
    versement?: {
        acompte: number;
        solde: number;
        realise: number;
        compensation: {
            "n-1": number;
            reversement: number;
        };
    };
    actions_proposee?: {
        ej?: string;
        rang?: number;
        intitule: string;
        objectifs?: string;
        objectifs_operationnels?: string;
        description?: string;
        nature_aide?: string;
        modalite_aide?: string;
        modalite_ou_dispositif?: string;
        indicateurs?: string;
        cofinanceurs?: {
            noms: string;
            montant_demandes: number;
        };
        montants_versement?: {
            total?: number;
            demande?: number;
            propose?: number;
            accorde?: number;
            attribue?: number;
            realise?: number;
            compensation?: number;
        };
    }[];
    co_financement?: {
        cofinanceur: string;
        cofinanceur_email: string;
        cofinanceur_siret?: string;
        montants: number;
    };
    territoires?: {
        status: string;
        commentaire: string;
    }[];
    evaluation?: {
        evaluation_resultat: string;
        cout_total_realise: number;
    };
}
