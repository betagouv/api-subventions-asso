import { ObjectId } from "mongodb";

export default interface FonjepTiersDbo {
    _id: ObjectId;
    Code: string | null;
    RaisonSociale: string | null;
    EstAssociation: string | null;
    EstCoFinanceurPostes: string | null;
    EstFinanceurPostes: string | null;
    SiretOuRidet: string | null;
    CodePostal: string | null;
    Ville: string | null;
    ContactEmail: string | null;
}
