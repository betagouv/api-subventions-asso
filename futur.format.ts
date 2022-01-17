// Ceci est un fichier de réflexion sur le futur format sortie par l'api.
// Il sera modifié au fur et à mesure de l'avancer du parsage de donnée pour arriver à un état stable et compatible avec tous les providers.

/**
 * Un peu d'info pour les non dev
 * 
 * Une interface sert à représenter le format d'une donnée, une interface peut avoir comme enfants d'autres interfaces (exemple Association à comment enfant Etablissement)
 *  
 * Dans les accolades ont défini à gauche le nom de la donnée et à droite son type/interface. string === Chaine de caractère, number === a un nombre, ....
 * Les crochets derniers un type indique une liste de ce type, par exemple : commonNames: stirng[] peut être égale a ["nomA", "nomB", "nomC"]
 * autre exemple Event[] définit une liste de données répondant à l'interface Event (Soit plusieurs Event) 
 * 
 * Le point d'interrogation a la suite du nom signifie qu'elle est optionnel (On n'est pas sûr de pouvoir la retrouver via les différents imports)  
 * 
 * Si tu n'as rien compris, c'est normal, envoie un message à Victor ;) 
 * Have a good day
 */

// Find by assos
export interface Association {
    siren: string,
    "nic_siege": string,
    rna?: string,
    categorie_juridique: number,
    denomination: string;
    denominations_usuelle: string[],
    date_creation: Date,
    etablissements: Etablissement[],
    documents?: Document[],
}

export interface Etablissement { // All data is awailable in API (entreprise.data.gouv) expect the data signed with "data provider"
    siret: string,
    siege: boolean,
    addresse: {
        numero: string,
        type_voie: string,
        voie: string,
        code_postal: string,
        commune: string,
    }
    representants_legal?: { // data provider
        nom?: string,
        prenom?: string,
        civilite?: string,
        telephone?: string,
        email?: string,
        role?: string
    }[]
    information_banquaire?: { // data provider
        iban?: string,
        bic?: string,
    }
    demandes: Demande[], // data provider
    documents?: Document[],
}

export interface Demande { // data provider
    service_instructeur: string,
    dispositif: string,
    sous_dispositif: string,
    date_commision?: Date,
    creer_le?: Date,
    transmis_le?: Date,
    contact: {
        email: string,
        telephone?: string,
    }
    status: string,
    montants?: {
        total: number,
        demande: number,
        propose: number,
        accorde: number,
    },
    versement?: {
        acompte: number,
        solde: number,
        realiser: number,
        compensation: {
            'n-1': number,
            reversement: number,
        }
    },
    actions_proposee?: unknown[] // Revoirs
    evenements?: Evenement[],
    documents?: Document[],
}

export interface Evenement { // Représente les données chorus ou autre evennement au cours de la vie d'un dossier
    type: string // Bancaire ou autre
}

export interface Document {
    type: string, // exemple: rib
    nom: string, // RIB_assos_x
    url: string, // Lien pour télécharger le fichier
    dernierre_modification: Date
}