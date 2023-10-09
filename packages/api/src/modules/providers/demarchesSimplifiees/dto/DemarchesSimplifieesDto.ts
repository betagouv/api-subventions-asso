import { Rna, Siret } from "dto";

export default interface DemarchesSimplifieesDto {
    data: {
        demarche: {
            dossiers: {
                nodes: [
                    {
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
                        dateTraitement: string | null;
                        pdf: {
                            url: string;
                            filename: string;
                            contentType: string;
                        };
                        champs: {
                            id: string;
                            label: string;
                            stringValue: string;
                        }[];
                        annotations: {
                            id: string;
                            label: string;
                            stringValue: string;
                        }[];
                    },
                ];
            };
        };
    } | null;
}
