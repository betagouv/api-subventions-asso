import { Siret } from "dto";

export default interface SubventiaLineEntity {
    service_instructeur: string;
    anne_demande: number;
    siret: Siret;
    date_commision: Date;
    montants_accorde: number;
    montants_demande: number;
    dispositif: string;
    sous_dispositif: string;
    status: string;
    reference_demande: string;
}

export type SubventiaDbo = SubventiaLineEntity & { __data__: Record<string, unknown> };
