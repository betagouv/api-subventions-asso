/**
 * /!\ This DTO is not complete, because no docs are found, so we complete as we go along.
 * Please check if attribute is already here before use this
 */
export default interface DauphinSubventionDto {
    id: string;
    reference: string;
    _document: {
        dateVersion: string;
    };
    history: {
        events: { date: string }[];
        begin: { date: string };
    };
    intituleProjet: string;
    description?: {
        value: string;
    };
    virtualStatusLabel: string;
    dateDemande: string;
    exerciceBudgetaire: number;
    financeursPrivilegies?: [
        {
            title: string;
        },
    ];
    thematique?: {
        title?: string;
    };
    status: string;
    demandeur: {
        SIRET: {
            complet: string;
            SIREN: string;
        };
    };
    periode: "PLURIANNUELLE" | "PONCTUELLE"; // TODO make type

    planFinancement: [
        {
            current: boolean;
            recette?: {
                postes?: [
                    {
                        reference: string;
                        sousPostes?: [
                            {
                                reference: string;
                                lignes?: [
                                    {
                                        dispositifEligible: boolean;
                                        montant: { ht: number };
                                        financement?: {
                                            montantVote?: { ht: number };
                                            financeur: { typeFinanceur: string; titre: string };
                                        };
                                    },
                                ];
                            },
                        ];
                    },
                ];
            };
        },
    ];
}
