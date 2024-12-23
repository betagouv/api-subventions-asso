import * as Sentry from "@sentry/node";
import {
    idEntrepriseType,
    idEtablissementType,
    typeIdEntreprise,
    typeIdEtablissement,
} from "../valueObjects/typeIdentifier";

export default class PaymentFlatEntity {
    private static regionMapping: Record<string, string> = {
        ADCE: "Administration Centrale",
        DEFE: "Administration Centrale",
        DILA: "Administration Centrale",
        ETR1: "Administration Centrale",

        DOM1: "DOM-TOM",
        DOM2: "DOM-TOM",
        DOM3: "DOM-TOM",
        DOM4: "DOM-TOM",

        ALSA: "Grand Est",
        LORR: "Grand Est",
        CHAR: "Grand Est",

        AQUI: "Nouvelle-Aquitaine",
        LIMO: "Nouvelle-Aquitaine",
        POIT: "Nouvelle-Aquitaine",

        AUVE: "Auvergne-Rhône-Alpes",
        RALP: "Auvergne-Rhône-Alpes",

        BNOR: "Normandie",
        HNOR: "Normandie",

        BOUR: "Bourgogne-Franche-Comté",
        FRCO: "Bourgogne-Franche-Comté",

        BRET: "Bretagne",

        CENT: "Centre-Val de Loire",

        CORS: "Corse",

        IDF1: "Île-de-France",

        LANG: "Occitanie",
        MIPY: "Occitanie",

        NORP: "Hauts-de-France",
        PICA: "Hauts-de-France",

        PACA: "Provence-Alpes-Côte d'Azur",

        PAYL: "Pays de la Loire",
    };

    public regionAttachementComptable: string | null;

    constructor(
        public uniqueId: string,
        public idVersement: string,
        public exerciceBudgetaire: number,
        public typeIdEtablissementBeneficiaire: typeIdEtablissement,
        public idEtablissementBeneficiaire: idEtablissementType<typeIdEtablissement>,
        public typeIdEntrepriseBeneficiaire: typeIdEntreprise,
        public idEntrepriseBeneficiaire: idEntrepriseType<typeIdEntreprise>,
        public amount: number,
        public operationDate: Date,
        public programName: string | null,
        public programNumber: number,
        public mission: string | null,
        public ministry: string | null,
        public ministryAcronym: string | null,
        public ej: string,
        public provider: string,
        public actionCode: string,
        public actionLabel: string | null,
        public activityCode: string | null,
        public activityLabel: string | null,
        public centreFinancierCode: string | null,
        public centreFinancierLibelle: string | null,
        public attachementComptable: string | null,
    ) {
        this.regionAttachementComptable = PaymentFlatEntity.getRegionAttachementComptable(attachementComptable);
    }

    public static getRegionAttachementComptable(attachementComptable: string | null): string | null {
        if (!attachementComptable) return null;

        const region = PaymentFlatEntity.regionMapping[attachementComptable];
        if (region === undefined) {
            const errorMessage = `Unknown region code: ${attachementComptable}`;
            Sentry.captureException(new Error(errorMessage));
            console.error(errorMessage);
            return null;
        }
        return region;
    }
}
