import { Siret } from "@api-subventions-asso/dto";

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
        nonbeneficiaire: string;
        nature: string;
        nomattribuant: string; // centre financier
        idbeneficiare: Siret;
        pourcentagesubvention: number;
        conditionsversement: "UNIQUE" | "ECHELONNE";
        idattribuant: Siret;
        referencedecision: string | null; // often null
    };
}
