import { InformationBancaire } from "../shared/InformationBancaire";
import { Personne } from "../shared/Personne";
import { SimplifiedEstablishment } from "./SimplifiedEstablishment";

export interface Establishment extends SimplifiedEstablishment {
    representantsLegaux?: Personne[];
    contacts?: Personne[];
    informationBanquaire?: InformationBancaire[];
}
