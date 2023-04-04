import { DemandeSubvention } from "../search/DemandeSubvention";
import { Versement } from "../versements";

export interface ApplicationDto {
    application?: DemandeSubvention;
    payments: Versement[];
    joinKey: string;
}
