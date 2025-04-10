import Siren from "./Siren";
import Rid from "./Rid";
import Tahiti from "./Tahiti";

import Siret from "./Siret";
import Ridet from "./Ridet";
import Tahitiet from "./Tahitiet";

export type companyIdName = "siren" | "rid" | "tahiti";
// tahitiet was defined by us because tahiti numbers doesn't have any name for their establishment identifier name (like siren - siret)
export type establishmentIdName = "siret" | "ridet" | "tahitiet";

export type establishmentIdType = Siret | Ridet | Tahitiet;

export type companyIdType = Siren | Rid | Tahiti;
