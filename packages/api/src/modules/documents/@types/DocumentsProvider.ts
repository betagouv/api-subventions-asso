import { Siret, Rna, Siren } from "@api-subventions-asso/dto";
import Provider from '../../providers/@types/IProvider';
import { Document } from "@api-subventions-asso/dto/search/Document";

export default interface DocumentProvider extends Provider {
    isDocumentProvider: boolean,

    getDocumentsBySiren(siren: Siren): Promise<Document[] | null>;
    getDocumentsBySiret(siret: Siret): Promise<Document[] | null>;
    getDocumentsByRna(rna: Rna): Promise<Document[] | null>;
}