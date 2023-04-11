import { Siret, Rna, Siren } from "@api-subventions-asso/dto";
import { Document } from "@api-subventions-asso/dto/search/Document";
import Provider from "../../providers/@types/IProvider";

export default interface DocumentProvider extends Provider {
    isDocumentProvider: boolean;

    getDocumentsBySiren(siren: Siren): Promise<Document[] | null>;
    getDocumentsBySiret(siret: Siret): Promise<Document[] | null>;
    getDocumentsByRna(rna: Rna): Promise<Document[] | null>;

    getRibsBySiren?: (siren: Siren) => Promise<Document[]>
}
