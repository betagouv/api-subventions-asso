export const DTO = [
    {
        exerciceBudgetaire: 2020,
        programme: "120-Programme",
        regionAttachementComptable: "Occitanie",
        montant: 12222000.22,
    },
    {
        exerciceBudgetaire: 2020,
        programme: "120-Programme",
        regionAttachementComptable: "Nord",
        montant: 3334.2002,
    },

    {
        exerciceBudgetaire: 2020,
        programme: "124-Programme",
        regionAttachementComptable: "Occitanie",
        montant: 33,
    },
];

export const DTO_FORMATTED = [
    { ...DTO[0], montant: "12 222 000" },
    { ...DTO[1], montant: "3 334" },
    { ...DTO[2], montant: "33" },
];

export const HEADERS_ALL = ["Exercice", "Programme", "Attachement comptable", "Montant (EUR)"];

export const VARS = {
    REGION_ATTACHEMENT_COMPTABLE: "regionAttachementComptable",
    PROGRAMME: "programme",
    EXERCICE: "exerciceBudgetaire",
    MONTANT: "montant",
};
