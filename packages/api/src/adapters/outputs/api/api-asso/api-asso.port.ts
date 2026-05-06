import { Association, Establishment } from "dto";
import { AssociationIdentifier, Rna, Siren } from "../../../../identifier-objects";
import { DocumentsDto } from "../../../../modules/providers/api-asso/dto/StructureDto";

// @TODO: no import from package dto inside adapters
// move mapping inside domain
export default interface ApiAssoPort {
    findRnaSiren(identifier: Rna | Siren): Promise<{ rna: Rna; siren: Siren } | null>;
    findAssociationByRna(rna: Rna): Promise<Association | null>;
    findAssociationBySiren(siren: Siren): Promise<Association | null>;
    findEstablishmentsBySiren(siren: Siren): Promise<Establishment | null>;
    // @TODO: rename DocumentsDto into ApiAssoDocumentDto
    fetchDocuments(identifier: AssociationIdentifier): Promise<DocumentsDto | undefined>;
}
