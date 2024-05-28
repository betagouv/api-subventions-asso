import { Siret, ApplicationStatus } from "dto";
import { ObjectId } from "mongodb";
import SubventiaDto from "./subventia.dto";

export default interface SubventiaEntity {
    service_instructeur: string;
    anne_demande: number;
    siret: Siret;
    date_commision: Date;
    montants_accorde: number;
    montants_demande: number;
    dispositif: string;
    sous_dispositif: string;
    status: ApplicationStatus;
    reference_demande: string;
    provider: string;
}
/* __data__ est un tableau de SubventiaDto car dans les données brutes, 
    il y a 12 lignes pour une même subvention. Une ligne par poste de dépense 
    (voir README.md pour plus de détails)
*/
export type SubventiaDbo = SubventiaEntity & { _id: ObjectId; __data__: SubventiaDto[] };
