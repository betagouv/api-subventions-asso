export interface OmogenFile {
    correlationID: string;
    nomFichier: string;
    dateDepot: string;
    format: Date;
    metadonnees?: OmogenMetadata[];
}

export interface OmogenMetadata {
    clef: string;
    valeur: string;
}

export interface OmogenToken {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    token_type: string;
    "not-before-policy": number;
    scope: string;
}
