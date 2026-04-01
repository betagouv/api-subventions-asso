import { RnaDto, SirenDto } from ".";

/**
 * Identifiant d'une association : RNA ou SIREN.
 * @example "W123456789"
 */
export type AssociationIdentifierDto = RnaDto | SirenDto;
