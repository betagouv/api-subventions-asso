import { Rna, Siret } from "dto";
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
        champs: Record<string, Record<string, DemarchesSimplifieesField>>;
        annotations: DefaultObject<string>;
    };
    service: {
        nom: string;
        organisme: string;
    };
}

export type DemarchesSimplifieesField = { value: string; label: string };
