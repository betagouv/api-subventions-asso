import DEFAULT_ASSOCIATION from "../../../../../../tests/__fixtures__/association.fixture";
import { extractWords } from "../../../../../shared/helpers/StringHelper";
import AssociationSearchDbo from "../@types/AssociationSearchDbo";

const COMMON_WORD = "TENNIS";

export const ASSOCIATION_SEARCH_DBOS: AssociationSearchDbo[] = [
    {
        siren: DEFAULT_ASSOCIATION.siren,
        mainEstablishmentSiret: DEFAULT_ASSOCIATION.siret,
        rna: DEFAULT_ASSOCIATION.rna,
        name: {
            rna: `rna-${DEFAULT_ASSOCIATION.name}`,
            sirene: `sirene-${DEFAULT_ASSOCIATION.name}`,
        },
        searchName: ` ${DEFAULT_ASSOCIATION.name.toLowerCase()} `,
        nameTokens: extractWords(DEFAULT_ASSOCIATION.name.toLowerCase()),
        object: "ROLE AND DEFINITION OF THE ASSOCIATION",
        searchObject: " ROLE AND DEFINITION OF THE ASSOCIATION ".toLowerCase(),
        objectTokens: extractWords("ROLE AND DEFINITION OF THE ASSOCIATION".toLowerCase()),
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
        name: {
            rna: `${COMMON_WORD} DE TABLE LYON`,
            sirene: `LE ${COMMON_WORD} DE TABLE LYONNAIS`,
        },
        searchName: ` ${COMMON_WORD.toLowerCase()} de table lyon `,
        nameTokens: ["tennis", "de", "table", "lyon"],
        object: "Jouer ensemble et s'amuser autour de la petite balle",
        searchObject: " jouer ensemble et s amuser autour de la petite balle ",
        objectTokens: ["jouer", "ensemble", "et", "amuser", "autour", "de", "la", "petite", "balle"], // remove élision "s"
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
    {
        siren: "300000000",
        mainEstablishmentSiret: "30000000000018",
        rna: "W300000000",
        name: {
            rna: `${COMMON_WORD} CLUB DE LYON`,
            sirene: `LE ${COMMON_WORD} LYONNAIS`,
        },
        searchName: ` ${COMMON_WORD.toLowerCase()} de lyon `,
        nameTokens: ["tennis", "de", "lyon"],
        object: "S'amuser avec une moyenne balle jaune, seul ou en équipe",
        searchObject: " s amuser avec une moyenne balle jaune seul ou en equipe ",
        objectTokens: ["amuser", "avec", "une", "moyenne", "balle", "jaune", "seul", "ou", "en", "equipe"], // remove élision "s"
        address: {
            number: "14",
            type: "avenue",
            name: "de la Liberté",
            city: "Lyon",
            postalCode: "69000",
            complement: null,
        },
        nbEstabs: 2,
        postalCodes: ["69000", "69001"],
    },
    {
        siren: "400000000",
        mainEstablishmentSiret: "40000000000018",
        rna: "W400000000",
        name: {
            rna: `Le bal masqué`,
        },
        searchName: ` le bal masque `,
        nameTokens: ["le", "bal", "masque"],
        object: "Le plaisir de l'anonymat au service du jeu",
        searchObject: " le plaisir de l anonymat au service du jeu ",
        objectTokens: ["le", "plaisir", "de", "anonymat", "au", "service", "du", "jeu"], // remove élision "l"
        address: {
            number: "18",
            type: "rue",
            name: "Lavoisier",
            city: "Guingamp",
            postalCode: "22200",
            complement: null,
        },
        nbEstabs: 1,
        postalCodes: ["22200"],
    },
    {
        siren: "500000000",
        mainEstablishmentSiret: "50000000000018",
        rna: "W500000000",
        name: {
            rna: `Poupenn`,
        },
        searchName: ` creche parentale `,
        nameTokens: ["creche", "parentale"],
        object: "Veiller à l'éveil des enfants de 3 mois à 4 ans",
        searchObject: " veiller a l eveil des enfants de 3 mois a 4 ans ",
        objectTokens: ["veiller", "a", "eveil", "des", "enfants", "de", "3", "mois", "a", "4", "ans"], // remove élision "l"
        address: {
            number: "16",
            type: "rue",
            name: "de la fôret",
            city: "Saint-Brieuc",
            postalCode: "22000",
            complement: null,
        },
        nbEstabs: 1,
        postalCodes: ["22000"],
    },
];
