import { Siret, Rna, Siren, DocumentDto } from "dto";
import Provider from "../../providers/@types/IProvider";

export default interface DocumentProvider extends Provider {
    isDocumentProvider: boolean;

    getDocumentsBySiren(siren: Siren): Promise<DocumentDto[] | null>;
    getDocumentsBySiret(siret: Siret): Promise<DocumentDto[] | null>;
    getDocumentsByRna(rna: Rna): Promise<DocumentDto[] | null>;

    getRibsBySiret?: (siren: Siren) => Promise<DocumentDto[]>;
}
