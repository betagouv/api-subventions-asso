import { CaisseDepotsDatasetDto } from "../../../src/modules/providers/caisseDepots/dto/CaisseDepotsDto";
import { ATTRIBUANT_SIRET } from "../../__fixtures__/attribuant.fixture";

export const CAISSE_DES_DEPOTS_DTO: CaisseDepotsDatasetDto = {
    total_count: 2,
    links: [
        {
            rel: "self",
            href: "URL",
        },
        {
            rel: "first",
            href: "URL",
        },
        {
            rel: "last",
            href: "URL",
        },
    ],
    records: [
        {
            links: [
                {
                    rel: "self",
                    href: "https://opendata.caissedesdepots.fr/api/v2/catalog/datasets/subventions-attribuees-par-la-caisse-des-depots-depuis-01012018/records/f84f45a69fca47a7f8a36665b94db7719208abdf",
                },
                { rel: "datasets", href: "https://opendata.caissedesdepots.fr/api/v2/catalog/datasets" },
                {
                    rel: "dataset",
                    href: "https://opendata.caissedesdepots.fr/api/v2/catalog/datasets/subventions-attribuees-par-la-caisse-des-depots-depuis-01012018",
                },
            ],
            record: {
                id: "f84f45a69fca47a7f8a36665b94db7719208abdf",
                timestamp: "2022-05-05T13:09:20.739Z",
                size: 309,
                fields: {
                    nomattribuant: "Caisse des d\u00e9p\u00f4ts et Consignations",
                    idattribuant: ATTRIBUANT_SIRET,
                    dateconvention: "2018-05",
                    referencedecision: null,
                    idbeneficiaire: "10000000000001",
                    nombeneficiaire: "NOM_BENEFICIAIRE",
                    objet: 'ETUDE "IMPACTS DE LA TRANSITION AGRICOLE ET ALIMENTAIRE SUR L\u2019EMPLOI"',
                    montant: 40000.0,
                    nature: "Aide en num\u00e9raire",
                    conditionsversement: "ECHELONNE",
                    datesversement_debut: "2022-05",
                    datesversement_fin: "2023-05-15",
                    idrae: null,
                    notificationue: "Non",
                    pourcentagesubvention: 1,
                },
            },
        },
        {
            links: [
                {
                    rel: "self",
                    href: "https://opendata.caissedesdepots.fr/api/v2/catalog/datasets/subventions-attribuees-par-la-caisse-des-depots-depuis-01012018/records/74959357aff2a17c3a876310f5d90bb037a80427",
                },
                { rel: "datasets", href: "https://opendata.caissedesdepots.fr/api/v2/catalog/datasets" },
                {
                    rel: "dataset",
                    href: "https://opendata.caissedesdepots.fr/api/v2/catalog/datasets/subventions-attribuees-par-la-caisse-des-depots-depuis-01012018",
                },
            ],
            record: {
                id: "74959357aff2a17c3a876310f5d90bb037a80427",
                timestamp: "2022-05-05T13:10:26.918Z",
                size: 263,
                fields: {
                    nomattribuant: "Caisse des d\u00e9p\u00f4ts et Consignations",
                    idattribuant: "18002002600019",
                    dateconvention: "2021-06",
                    referencedecision: null,
                    idbeneficiaire: "10000000000001",
                    nombeneficiaire:
                        "RECHERCHE ET EVALUATION DE SOLUTIONS INNOVANTES ET SOCIALES (RESOLIS ASSOCIATION)",
                    objet: "RESOLIS - ETUDE TAA 2021",
                    montant: 35000.0,
                    nature: "Aide en num\u00e9raire",
                    conditionsversement: "UNIQUE",
                    datesversement_debut: "2021-07",
                    datesversement_fin: null,
                    idrae: null,
                    notificationue: "Non",
                    pourcentagesubvention: 1,
                },
            },
        },
    ],
};
