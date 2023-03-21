import { Rna, Siret } from "@api-subventions-asso/dto";
import { DefaultObject } from "../../../../@types";

export default interface DemarchesSimplifieesDataEntity {
    siret: Siret;
    demarcheId: number;
    demande: {
        id: string;
        demandeur: {
            siret: Siret;
            association?: {
                rna: Rna;
                titre: string;
            };
        };
        demarche: {
            title: string;
        };
        groupeInstructeur: {
            label: string;
        };
        motivation: string | null;
        state: string | null;
        dateDepot: string | null;
        datePassageEnInstruction: string | null;
        dateDerniereModification: string;
        dateTraitement: string | null;
        pdf: {
            url: string;
            filename: string;
            contentType: string;
        };
        champs: DefaultObject<string>;
        annotations: DefaultObject<string>;
    };
}
