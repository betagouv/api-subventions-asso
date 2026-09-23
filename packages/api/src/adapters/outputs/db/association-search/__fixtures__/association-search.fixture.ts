import DEFAULT_ASSOCIATION from "../../../../../../tests/__fixtures__/association.fixture";

export const ASSOCIATION_SEARCH_DBOS = [
    {
        siren: DEFAULT_ASSOCIATION.siren,
        mainEstablishmentSiret: DEFAULT_ASSOCIATION.siret,
        rna: DEFAULT_ASSOCIATION.rna,
        name: DEFAULT_ASSOCIATION.name,
        searchName: DEFAULT_ASSOCIATION.name.toLowerCase(),
        object: "ROLE AND DEFINITION OF THE ASSOCIATION",
        searchObject: "ROLE AND DEFINITION OF THE ASSOCIATION".toLowerCase(),
        address: {
            number: "1",
            type: "RUE",
            name: "Général de Gaulle",
            city: "Paris",
            postalCode: "75000",
            complement: null,
        },
        nbEstabs: 2,
        postalCodes: ["75000", "75010"],
    },
    {
        siren: "200000000",
        mainEstablishmentSiret: "20000000000020",
        rna: "W200000000",
        name: "LYON ASSOCIATION",
        searchName: "lyon association",
        object: "ROLE AND DEFINITION OF THE ASSOCIATION",
        searchObject: "ROLE AND DEFINITION OF THE ASSOCIATION".toLowerCase(),
        address: {
            number: "2",
            type: "RUE",
            name: "Victor Hugo",
            city: "Lyon",
            postalCode: "69000",
            complement: null,
        },
        nbEstabs: 1,
        postalCodes: ["69000"],
    },
];
