import Siren from "./Siren";
import Rid from "./Rid";
import Thaiti from "./Thaiti";

import Siret from "./Siret";
import Ridet from "./Ridet";
import ThaitiT from "./Thaiti-t";

export type typeIdEntreprise = "siren" | "rid" | "thaiti";
export type typeIdEtablissement = "siret" | "ridet" | "thaiti-t";

export type idEtablissementType<T extends typeIdEtablissement> = T extends "siret"
    ? Siret
    : T extends "ridet"
    ? Ridet
    : T extends "thaiti-t"
    ? ThaitiT
    : never;

export type idEntrepriseType<T extends typeIdEntreprise> = T extends "siren"
    ? Siren
    : T extends "rid"
    ? Rid
    : T extends "thaiti"
    ? Thaiti
    : never;
