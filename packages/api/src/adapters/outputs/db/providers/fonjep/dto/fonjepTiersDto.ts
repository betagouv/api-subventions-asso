// null represents an empty cell in the file
export default interface FonjepTiersDto {
    Code: string;
    RaisonSociale: string | null;
    EstAssociation: string | null;
    EstCoFinanceurPostes: string | null;
    EstFinanceurPostes: string | null;
    SiretOuRidet: string | null;
    CodePostal: string | null;
    Ville: string | null;
    ContactEmail: string | null;
}
