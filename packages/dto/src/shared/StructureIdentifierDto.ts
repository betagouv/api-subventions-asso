import { AssociationIdentifierDto } from "./AssociationIdentifierDto";
import { EstablishmentIdentifierDto } from "./EstablishementIdentifierDto";

/**
 * Identifiant d'une structure : RNA, SIREN ou SIRET.
 * @example "W123456789"
 */
export type StructureIdentifierDto = AssociationIdentifierDto | EstablishmentIdentifierDto;
