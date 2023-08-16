import { Siret, Rna, Siren, Document } from "dto";
import Provider from "../../providers/@types/IProvider";

export default interface DocumentProvider extends Provider {
    isDocumentProvider: boolean;

    getDocumentsBySiren(siren: Siren): Promise<Document[] | null>;
    getDocumentsBySiret(siret: Siret): Promise<Document[] | null>;
    getDocumentsByRna(rna: Rna): Promise<Document[] | null>;

    getRibsBySiret?: (siren: Siren) => Promise<Document[]>;
}
