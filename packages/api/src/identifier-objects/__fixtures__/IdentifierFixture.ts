import AssociationIdentifier from "../AssociationIdentifier";
import Rid from "../Rid";
import Ridet from "../Ridet";
import Rna from "../Rna";
import Siren from "../Siren";
import Siret from "../Siret";
import Tahiti from "../Tahiti";
import Tahitiet from "../Tahitiet";

export const RNA = new Rna("W000000123");
export const SIREN = new Siren("100000023");
export const RID = new Rid("1000098");
export const TAHITI = new Tahiti("A00045");
export const SIRET = new Siret(SIREN.value + "00018");
export const RIDET = new Ridet(RID.value + "001");
export const TAHITIET = new Tahitiet(TAHITI.value + "345");

export const ASSOCIATION_IDENTIFIER = AssociationIdentifier.fromSirenAndRna(SIREN, RNA);
