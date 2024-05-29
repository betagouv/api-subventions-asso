import { Siret } from "dto";

export type OpenDataSoftLinks = { rel: string; href: string };

export interface CaisseDepotsDatasetDto {
    total_count: number;
    links: OpenDataSoftLinks[];
    records: { links: OpenDataSoftLinks[]; record: CaisseDepotsSubventionDto }[];
}

export type CaisseDepotsSubventionDto = {
    id: string;
    timestamp: string;
    size: number;
    fields: {
        montant: number;
        notificationue: "Oui" | "Non";
        objet: string;
        datesversement_debut: string;
        datesversement_fin: string | null;
        dateconvention: string;
        nombeneficiaire: string;
        nature: string;
        nomattribuant: string; // centre financier
        idbeneficiaire: Siret;
        pourcentagesubvention: number;
        conditionsversement: "UNIQUE" | "ECHELONNE";
        idattribuant: Siret;
        referencedecision: string | null; // often null
        idrae: string | null; // often null
    };
};
