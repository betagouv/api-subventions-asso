import AssociationIdentifier from "../AssociationIdentifier";
import Rna from "../Rna";
import Siren from "../Siren";

export const SIREN = new Siren("100000023");
export const RNA = new Rna("W000000123");
export const ASSOCIATION_IDENTIFIER = AssociationIdentifier.fromSirenAndRna(SIREN, RNA);
