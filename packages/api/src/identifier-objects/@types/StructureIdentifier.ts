import AssociationIdentifier from "../AssociationIdentifier";
import EstablishmentIdentifier from "../EstablishmentIdentifier";
import Rna from "../Rna";
import Siren from "../Siren";

export type StructureIdentifier = AssociationIdentifier | EstablishmentIdentifier;
export type FullAssociationIdentifier = AssociationIdentifier & { rna: Rna; siren: Siren };
