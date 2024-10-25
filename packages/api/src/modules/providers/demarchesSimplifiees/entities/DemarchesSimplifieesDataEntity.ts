import { RnaDto, SiretDto } from "dto";

export default interface DemarchesSimplifieesDataEntity {
    siret: SiretDto;
    demarcheId: number;
    demande: {
        id: string;
        demandeur: {
            siret: SiretDto;
            association?: {
                rna: RnaDto;
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
        champs: Record<string, DemarchesSimplifieesField>;
        annotations: Record<string, DemarchesSimplifieesField>;
    };
    service: {
        nom: string;
        organisme: string;
    };
}

export type DemarchesSimplifieesField = { value: string; label: string };
