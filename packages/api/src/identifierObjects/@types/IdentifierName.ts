import { RID_NAME } from "../Rid";
import { RIDET_NAME } from "../Ridet";
import { SIREN_NAME } from "../Siren";
import { SIRET_NAME } from "../Siret";
import { TAHITI_NAME } from "../Tahiti";
import { TAHITIET_NAME } from "../Tahitiet";

export type CompanyIdName = typeof SIREN_NAME | typeof RID_NAME | typeof TAHITI_NAME;
export type EstablishmentIdName = typeof SIRET_NAME | typeof RIDET_NAME | typeof TAHITIET_NAME;
