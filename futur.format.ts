// Ceci est un fichier de réflexion sur le futur format sortie par l'api.
// Il sera modifié au fur et à mesure de l'avancer du parsage de donnée pour arriver à un état stable et compatible avec tous les providers.

/**
 * Un peu d'info pour les non dev
 * 
 * Une interface sert à représenter le format d'une donnée, une interface peut avoir comme enfants d'autres interfaces (exemple Association à comment enfant Establishment)
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
    headquartersNIC: string,
    rna?: string,
    legalCategory: number,
    name: string;
    commonNames: string[],
    creationDate: Date,
    establishments: Establishment[],
}

export interface Establishment { // All data is awailable in API (entreprise.data.gouv) expect the data signed with "data provider"
    siret: string,
    isHeadquarters: boolean,
    address: {
        number: string,
        trackType: string,
        track: string,
        postalCode: string,
        townName: string,
    }
    legalRepresentative?: { // data provider
        firstname?: string,
        lastname?: string,
        civility?: string,
        phone?: string,
        email?: string,
        role?: string
    }

    banking?: { // data provider
        iban?: string,
        bic?: string,
    }
    requests: Request[], // data provider
}

export interface Request { // data provider
    instructorService: string,
    planName: string,
    subPlanName: string,
    commissionDate?: Date,
    createdAt?: Date,
    transmittedAt?: Date,
    contact: {
        email: string,
        phone?: string,
    }
    requestSate: string,
    amounts?: {
        total: number,
        required: number,
        offer: number,
        give: number,
    },
    payments?: {
        downPayment: number,
        balance: number,
        executed: number,
        adjustement: {
            lastYear: number,
            now: number,
        }
    },
    actions?: unknown[] // Revoirs
    events?: Event[],
}

export interface Event { // Représente les données chorus ou autre evennement au cours de la vie d'un dossier
    type: string // Bancaire ou autre
}