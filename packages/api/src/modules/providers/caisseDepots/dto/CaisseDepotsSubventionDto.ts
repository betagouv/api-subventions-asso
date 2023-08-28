import { Siret } from "dto";

export default interface CaisseDepotsSubventionDto {
    id: string;
    timestamp: string;
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
    };
}
