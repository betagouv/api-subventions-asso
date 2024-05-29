import { ObjectId } from "mongodb";
import DEFAULT_ASSOCIATION from "../../../__fixtures__/association.fixture";
import GRANTORS from "../../../__fixtures__/grantor.fixture";
import { siretToNIC, siretToSiren } from "../../../../src/shared/helpers/SirenHelper";

export const DAUPHIN_GISPRO_DBOS = [
    {
        _id: new ObjectId("632d640a5de73e7b04d28268"),
        dauphin: {
            active: true,
            id: "/referentiel-financement/api/tenants/cget/demandes-financement/REF_FINANCEMENT",
            cloture: {
                value: false,
            },
            linkedUsers: [],
            date: "2023-10-06T07:59:43.851Z",
            dateDemande: "2022-08-08T14:55:18.095Z",
            status: "ACCEPTABLE",
            reference: "REF_FINANCEMENT",
            referenceAdministrative: "REF_ADMINISTRATIVE",
            demandeEnNature: false,
            tenant: "cget",
            thematique: {
                href: "/referentiel-financement/api/tenants/cget/thematiques-financement/EducSportJeun",
                title: "Education – Sport - Jeunesse",
                reference: "EducSportJeun",
            },
            history: {
                begin: {
                    user: {
                        title: "John Doe",
                        reference: "AFEV_MA_VILLE",
                        expand: {
                            groups: ["user"],
                            active: true,
                            organization: "cget-demandeurs",
                            displayName: "John Doe",
                            name: {
                                givenName: "John",
                                familyName: "Doe",
                                honorificPrefix: "Monsieur",
                            },
                            userName: "AFEV_MA_VILLE",
                            emails: ["john.Doe@afev.org"],
                            externalId: "5cc2bf8b2aa8420008298619",
                            id: "AFEV_MA_VILLE",
                        },
                    },
                    date: "2022-06-24T08:25:21.782Z",
                },
                events: [
                    {
                        type: "STATUS",
                        date: "2022-06-24T08:25:33.519Z",
                        reference: "REQUESTED",
                        user: {
                            href: "/account-management/cget-demandeurs/users/AFEV_MA_VILLE",
                            title: "John Doe",
                            organization: "cget-demandeurs",
                            reference: "AFEV_MA_VILLE",
                        },
                        summary: "John Doe creates this entity with REQUESTED status",
                    },
                    {
                        type: "STATUS",
                        date: "2022-08-08T14:55:18.106Z",
                        reference: "WAITING_FOR_CERTIFICATE",
                        user: {
                            href: "/account-management/cget-demandeurs/users/AFEV_MA_VILLE",
                            title: "John Doe",
                            organization: "cget-demandeurs",
                            reference: "AFEV_MA_VILLE",
                        },
                        summary: "John Doe changes the status from REQUESTED to WAITING_FOR_CERTIFICATE",
                    },
                    {
                        type: "STATUS",
                        date: "2022-08-17T08:25:03.363Z",
                        reference: "TRANSMITTED",
                        user: {
                            href: "/account-management/cget-demandeurs/users/AFEV_National",
                            title: "Jeanne Martin",
                            organization: "cget-demandeurs",
                            reference: "AFEV_National",
                        },
                        summary: "Jeanne Martin changes the status from WAITING_FOR_CERTIFICATE to TRANSMITTED",
                    },
                    {
                        type: "STATUS",
                        date: "2022-08-18T07:25:32.644Z",
                        reference: "SUPPORTED",
                        user: {
                            href: "/account-management/cget-agents/users/BPE002",
                            title: "Christian Douglas",
                            organization: "cget-agents",
                            reference: "BPE002",
                        },
                        summary: "Christian Douglas changes the status from TRANSMITTED to SUPPORTED",
                    },
                    {
                        type: "STATUS",
                        date: "2022-08-18T12:13:52.360Z",
                        reference: "WAITING_FOR_CERTIFICATE",
                        user: {
                            href: "/account-management/cget-demandeurs/users/AFEV_MA_VILLE",
                            title: "John Doe",
                            organization: "cget-demandeurs",
                            reference: "AFEV_MA_VILLE",
                        },
                        summary: "John Doe changes the status from SUPPORTED to WAITING_FOR_CERTIFICATE",
                    },
                    {
                        type: "STATUS",
                        date: "2022-08-22T14:40:59.389Z",
                        reference: "SUPPORTED",
                        user: {
                            href: "/account-management/cget-demandeurs/users/AFEV_National",
                            title: "Jeanne Martin",
                            organization: "cget-demandeurs",
                            reference: "AFEV_National",
                        },
                        summary: "Jeanne Martin changes the status from WAITING_FOR_CERTIFICATE to SUPPORTED",
                    },
                    {
                        type: "STATUS",
                        date: "2022-09-05T17:03:22.480Z",
                        reference: "WAITING_FOR_CERTIFICATE",
                        user: {
                            href: "/account-management/cget-demandeurs/users/AFEV_MA_VILLE",
                            title: "John Doe",
                            organization: "cget-demandeurs",
                            reference: "AFEV_MA_VILLE",
                        },
                        summary: "John Doe changes the status from SUPPORTED to WAITING_FOR_CERTIFICATE",
                    },
                    {
                        type: "STATUS",
                        date: "2022-09-06T16:11:24.714Z",
                        reference: "SUPPORTED",
                        user: {
                            href: "/account-management/cget-demandeurs/users/AFEV_National",
                            title: "Jeanne Martin",
                            organization: "cget-demandeurs",
                            reference: "AFEV_National",
                        },
                        summary: "Jeanne Martin changes the status from WAITING_FOR_CERTIFICATE to SUPPORTED",
                    },
                    {
                        type: "STATUS",
                        date: "2022-09-07T09:57:16.515Z",
                        reference: "ACCEPTABLE",
                        user: {
                            href: "/account-management/cget-agents/users/EA013",
                            title: "Sophie Cluz",
                            organization: "cget-agents",
                            reference: "EA013",
                        },
                        summary: "Sophie Cluz changes the status from SUPPORTED to ACCEPTABLE",
                    },
                    {
                        type: "JUSTIFICATION_READY_TO_JUSTIFY",
                        date: "2023-01-30T19:58:01.217Z",
                        reference: "READY_TO_JUSTIFY",
                        user: {
                            href: "/account-management/cget-agents/users/internal-solution-integration",
                            title: "internal-solution-integration",
                            organization: "cget-agents",
                            reference: "internal-solution-integration",
                        },
                        summary: "internal-solution-integration justification ready to justify",
                    },
                ],
            },
            virtualStatus: "JUSTIFICATION_JUSTIFIED",
            virtualStatusLabel: "Justifiée",
            correlations: [],
            dossiersFinancement: [],
            specifiques: {},
            objet: {
                value: "OBJET",
            },
            description: {
                value: "DESCRIPTION",
            },
            libelle: {
                value: "LIBELLE",
            },
            demandeur: {
                reference: "N11m6bi8vFr",
                referenceAdministrative: "00751801",
                status: "SUPPORTED",
                tenant: "cget",
                title: "ASS NOM_ASSO",
                id: "URL_REF_TIER/N11m6bi8vFr",
                raisonSociale: "ASS NOM_ASSO",
                sigle: "AFEV",
                famille: {
                    href: "/referentiel-tiers/cget/familles/75",
                    title: "Association",
                    reference: "75",
                    expand: {
                        d: {
                            reference: "75",
                            libelle: "Association",
                            personnaliteJuridique: "MORALE",
                            typeFamille: "TIERS_ASSOCIATION",
                            actif: true,
                        },
                        reference: "75",
                    },
                },
                SIRET: {
                    SIREN: siretToSiren(DEFAULT_ASSOCIATION.siret),
                    NIC: siretToNIC(DEFAULT_ASSOCIATION.siret),
                    complet: DEFAULT_ASSOCIATION.siret,
                },
                NAF: {
                    title: "88.99B - Action sociale sans hébergement n.c.a.",
                    expand: {},
                },
                correlations: [
                    {
                        type: "CHORUS",
                        value: "/1001431934",
                        title: "CHORUS - 1001431934",
                        reference: "/referentiel-tiers/cget/applicationsExternes/CHORUS",
                        detail: {},
                    },
                ],
                situations: [],
                representants: [],
                externalData: {
                    apiEntreprise: {
                        siret: DEFAULT_ASSOCIATION.siret,
                        diffusableCommercialement: true,
                        raisonSociale: "ASS NOM_ASSO",
                        naf: {
                            code: "8899B",
                            libelle: "Action sociale sans hébergement n.c.a.",
                        },
                        adresse: {
                            l4: "221 RUE DE RENNES",
                            codePostal: "75010",
                            localite: "PARIS 10",
                        },
                        siegeSocial: true,
                        trancheEffectifSalarieEtablissement: {
                            intitule: "50 à 99 salariés",
                            dateReference: "2020",
                        },
                        dateCreationEtablissement: "2018-12-31T23:00:00.000Z",
                        regionImplantation: {
                            code: "11",
                            value: "Île-de-France",
                        },
                        communeImplantation: {
                            code: "75110",
                            value: "Paris 10e Arrondissement",
                        },
                        paysImplantation: {
                            code: "FR",
                            value: "FRANCE",
                        },
                        etatAdministratif: {
                            value: "A",
                        },
                        updatedOn: "2023-01-27T10:45:32.005Z",
                    },
                    apiEntrepriseEntreprise: {
                        diffusableCommercialement: true,
                        siren: DEFAULT_ASSOCIATION.siren,
                        raisonSociale: "ASS NOM_ASSO",
                        numeroTvaIntracommunautaire: "NUMERO_TVA_INTERCO",
                        formeJuridique: {
                            code: "9220",
                            libelle: "Association déclarée",
                        },
                        naf: {
                            code: "1111B",
                            libelle: "Action sociale sans hébergement n.c.a.",
                        },
                        trancheEffectifSalarieEntreprise: {
                            intitule: "250 à 499 salariés",
                            dateReference: "2020",
                        },
                        dateCreationEntreprise: "1991-08-11T22:00:00.000Z",
                        categorieEntreprise: "PME",
                        etatAdministratifEntreprise: "A",
                        updatedOn: "2023-01-27T10:45:32.005Z",
                    },
                    apiEntrepriseAssociation: {
                        id: DEFAULT_ASSOCIATION.rna,
                        titre: "ASSOCIATION DE LA NOM_ASSO AFEV",
                        objet: "mise en place d'actions de solidarités dans les quartiers en difficultés notamment dans le domaine du soutien scolaire",
                        dateDeclaration: "2022-07-12T00:00:00.000Z",
                        datePublication: "1991-08-28T00:00:00.000Z",
                        dateCreation: "1991-08-02T00:00:00.000Z",
                        groupement: "Simple",
                        siretSiegeSocial: "39032205500281",
                        miseAJour: "2022-07-12T00:00:00.000Z",
                        adresseSiege: {
                            complement: "_",
                            numeroVoie: "221",
                            typeVoie: "RUE",
                            libelleVoie: "la Fayette",
                            codePostal: "75010",
                            commune: "PARIS",
                        },
                        updatedOn: "2023-01-27T10:45:32.005Z",
                    },
                },
                active: true,
                NAFNiv732: "11.11B",
                user: {},
                domiciliationsBancaires: [],
                date: "2023-10-06T14:44:28.018Z",
                kind: "tiers",
                characteristics: {},
                statusLabel: "Valide",
                courrielsValues: ["lorem.ipsum@afev.org"],
                adresse: "221 RUE DE RENNES 75010 PARIS 10 FRANCE",
                situationPrincipale: {
                    principale: true,
                    typeAdresse: "ADM",
                    expand: {
                        afnor: {
                            LigneSix: "75010 PARIS 10",
                        },
                        codeInsee: "75110",
                        geographique: {
                            NomVoie: "221 RUE DE RENNES",
                            Cedex: "V",
                            CodePostal: "75010",
                            Localite: {
                                code: "75110",
                                value: "PARIS 10E ARRONDISSEMENT",
                            },
                            Pays: {
                                code: "FR",
                                value: "FRANCE",
                            },
                        },
                        regionInsee: {
                            code: "11",
                            value: "Île-de-France",
                        },
                        departementInsee: {
                            code: "75",
                            value: "Paris",
                        },
                        communeInsee: {
                            code: "75110",
                            value: "Paris 10e Arrondissement",
                        },
                        epciInsee: {
                            code: "ZZZZZZZZZ",
                            value: "Sans objet",
                        },
                        courriels: [
                            {
                                TYPE: "internet",
                                value: "lorem.ipsum@afev.org",
                            },
                        ],
                        sitesWeb: ["https://afev.org/"],
                        telephones: [
                            {
                                TYPE: "cell",
                                value: "06 05 05 50 50",
                            },
                        ],
                    },
                    telephonesParType: {
                        cell: [
                            {
                                TYPE: "cell",
                                value: "06 05 05 50 50",
                            },
                        ],
                    },
                    reference: "NyCBgx8-I",
                },
                "thematiques-tiers-association": {
                    datePublicationRegistre: "1991-08-01T22:00:00.000Z",
                    descriptionActivites: "Association d'éducation populaire",
                    descriptionActivitesComplementaires:
                        "L'AFEV organise l'intervention bénévole de près de 18 000 étudiants chaque année, dans des actions de solidarité, auprès des enfants et jeunes en fragilité sociale et scolaire dans les quartiers prioritaires.",
                    enActivite: true,
                    adherentMoral: "FAC, AFEV Region, Socrate",
                    utilitePublique: {
                        value: false,
                    },
                    commissaireAuxComptes: true,
                    reference: "N11m6bi8vFr",
                    date: "2023-04-17T09:00:56.111Z",
                    active: true,
                    agrements: [
                        {
                            type: "Agrément national de jeunesse et d'éducation populaire de l'association",
                            attribuePar: "Ministre de la jeunesse, des sports et de la vie associative",
                            enDateDu: "2006-04-10T22:00:00.000Z",
                        },
                        {
                            type: "Entreprise solidaire à utilité sociale",
                            attribuePar:
                                "Ministère du travail de l'emploi et de la formation professionnelle  et du dialogue social",
                            enDateDu: "2021-12-26T23:00:00.000Z",
                            numero: "75-2021-12-27-00004",
                        },
                        {
                            type: "Agrément national au titre des associations éducatives complémentaires de l'enseignement public",
                            attribuePar: "Ministère de l'éducation nationale",
                            enDateDu: "2022-05-30T22:00:00.000Z",
                            numero: "N°DGESCO-D2022-008151",
                        },
                    ],
                    codeRNA: DEFAULT_ASSOCIATION.rna,
                    associationSportiveAgreee: false,
                },
                libelleLong: "ASS NOM_ASSO 390322055 00281",
                tiersMorale: true,
                tiersPhysique: false,
                fulltext: "ASS NOM_ASSO 390322055 00281 (00751801)",
                titlePure: "ASS NOM_ASSO",
            },
            beneficiaires: [
                {
                    reference: "N11m6bi8vFr",
                    referenceAdministrative: "00751801",
                    status: "SUPPORTED",
                    tenant: "cget",
                    title: "ASS NOM_ASSO",
                    id: "URL_REF_TIER/N11m6bi8vFr",
                    raisonSociale: "ASS NOM_ASSO",
                    sigle: "AFEV",
                    famille: {
                        href: "/referentiel-tiers/cget/familles/75",
                        title: "Association",
                        reference: "75",
                        expand: {
                            d: {
                                reference: "75",
                                libelle: "Association",
                                personnaliteJuridique: "MORALE",
                                typeFamille: "TIERS_ASSOCIATION",
                                actif: true,
                            },
                            reference: "75",
                        },
                    },
                    SIRET: {
                        SIREN: siretToSiren(DEFAULT_ASSOCIATION.siret),
                        NIC: siretToNIC(DEFAULT_ASSOCIATION.siret),
                        complet: DEFAULT_ASSOCIATION.siret,
                    },
                    NAF: {
                        title: "11.11B - Action sociale sans hébergement n.c.a.",
                        expand: {},
                    },
                    correlations: [
                        {
                            type: "CHORUS",
                            value: "/1001431934",
                            title: "CHORUS - 1001431934",
                            reference: "/referentiel-tiers/cget/applicationsExternes/CHORUS",
                            detail: {},
                        },
                    ],
                    situations: [],
                    representants: [],
                    externalData: {
                        apiEntreprise: {
                            siret: "39032205500281",
                            diffusableCommercialement: true,
                            raisonSociale: "ASS NOM_ASSO",
                            naf: {
                                code: "8899B",
                                libelle: "Action sociale sans hébergement n.c.a.",
                            },
                            adresse: {
                                l4: "221 RUE DE RENNES",
                                codePostal: "75010",
                                localite: "PARIS 10",
                            },
                            siegeSocial: true,
                            trancheEffectifSalarieEtablissement: {
                                intitule: "50 à 99 salariés",
                                dateReference: "2020",
                            },
                            dateCreationEtablissement: "2018-12-31T23:00:00.000Z",
                            regionImplantation: {
                                code: "11",
                                value: "Île-de-France",
                            },
                            communeImplantation: {
                                code: "75110",
                                value: "Paris 10e Arrondissement",
                            },
                            paysImplantation: {
                                code: "FR",
                                value: "FRANCE",
                            },
                            etatAdministratif: {
                                value: "A",
                            },
                            updatedOn: "2023-01-27T10:45:32.005Z",
                        },
                        apiEntrepriseEntreprise: {
                            diffusableCommercialement: true,
                            siren: "390322055",
                            raisonSociale: "ASS NOM_ASSO",
                            numeroTvaIntracommunautaire: "TVA_INTERCO",
                            formeJuridique: {
                                code: "9220",
                                libelle: "Association déclarée",
                            },
                            naf: {
                                code: "1111B",
                                libelle: "Action sociale sans hébergement n.c.a.",
                            },
                            trancheEffectifSalarieEntreprise: {
                                intitule: "250 à 499 salariés",
                                dateReference: "2020",
                            },
                            dateCreationEntreprise: "1991-08-11T22:00:00.000Z",
                            categorieEntreprise: "PME",
                            etatAdministratifEntreprise: "A",
                            updatedOn: "2023-01-27T10:45:32.005Z",
                        },
                        apiEntrepriseAssociation: {
                            id: "W751100895",
                            titre: "ASSOCIATION DE LA NOM_ASSO AFEV",
                            objet: "mise en place d'actions de solidarités dans les quartiers en difficultés notamment dans le domaine du soutien scolaire",
                            dateDeclaration: "2022-07-12T00:00:00.000Z",
                            datePublication: "1991-08-28T00:00:00.000Z",
                            dateCreation: "1991-08-02T00:00:00.000Z",
                            groupement: "Simple",
                            siretSiegeSocial: DEFAULT_ASSOCIATION.siret,
                            miseAJour: "2022-07-12T00:00:00.000Z",
                            adresseSiege: {
                                complement: "_",
                                numeroVoie: "221",
                                typeVoie: "RUE",
                                libelleVoie: "la Fayette",
                                codePostal: "75010",
                                commune: "PARIS",
                            },
                            updatedOn: "2023-01-27T10:45:32.005Z",
                        },
                    },
                    active: true,
                    NAFNiv732: "11.11B",
                    user: {},
                    domiciliationsBancaires: [],
                    date: "2023-10-06T14:44:28.018Z",
                    kind: "tiers",
                    characteristics: {
                        hasAdministrator: true,
                        isKnown: true,
                    },
                    statusLabel: "Valide",
                    courrielsValues: ["lorem.ipsum@afev.org"],
                    adresse: "221 RUE DE RENNES 75010 PARIS 10 FRANCE",
                    situationPrincipale: {},
                    libelleLong: "ASS NOM_ASSO 390322055 00281",
                    tiersMorale: true,
                    tiersPhysique: false,
                    fulltext: "ASS NOM_ASSO 390322055 00281 (00751801)",
                    titlePure: "ASS NOM_ASSO",
                },
            ],
            exerciceBudgetaire: 2022,
            conformite: {
                value: true,
            },
            dispositif: {
                title: "v8 - Action de demande",
            },
            teleservice: {},
            pieces: [],
            planFinancement: [
                {
                    depense: {
                        postes: [
                            {
                                reference: "60",
                                libelle: {
                                    value: "60 - Achats",
                                },
                                lignes: [
                                    {
                                        reference: "604",
                                        libelle: {
                                            value: "Prestations de services",
                                        },
                                    },
                                    {
                                        reference: "601",
                                        libelle: {
                                            value: "Achats matières et fournitures",
                                        },
                                        montant: {
                                            ht: 8974,
                                        },
                                    },
                                    {
                                        reference: "60x",
                                        libelle: {
                                            value: "Autres fournitures",
                                        },
                                        montant: {
                                            ht: 200,
                                        },
                                    },
                                ],
                                montant: {
                                    ht: 9174,
                                },
                            },
                            {
                                reference: "61",
                                libelle: {
                                    value: "61 - Service extérieurs",
                                },
                                lignes: [
                                    {
                                        reference: "613",
                                        libelle: {
                                            value: "Locations",
                                        },
                                        montant: {
                                            ht: 4550,
                                        },
                                    },
                                    {
                                        reference: "615",
                                        libelle: {
                                            value: "Entretien et réparation",
                                        },
                                        montant: {
                                            ht: 917,
                                        },
                                    },
                                    {
                                        reference: "616",
                                        libelle: {
                                            value: "Assurance",
                                        },
                                        montant: {
                                            ht: 713,
                                        },
                                    },
                                    {
                                        reference: "618",
                                        libelle: {
                                            value: "Documentation",
                                        },
                                        montant: {
                                            ht: 830,
                                        },
                                    },
                                ],
                                montant: {
                                    ht: 7010,
                                },
                            },
                            {
                                reference: "62",
                                libelle: {
                                    value: "62 - Autres services extérieurs",
                                },
                                lignes: [
                                    {
                                        reference: "622",
                                        libelle: {
                                            value: "Rémunérations intermédiaires et honoraires",
                                        },
                                        montant: {
                                            ht: 6933,
                                        },
                                    },
                                    {
                                        reference: "623",
                                        libelle: {
                                            value: "Publicité, publication",
                                        },
                                        montant: {
                                            ht: 5747,
                                        },
                                    },
                                    {
                                        reference: "625",
                                        libelle: {
                                            value: "Déplacements, Missions",
                                        },
                                        montant: {
                                            ht: 2279,
                                        },
                                    },
                                    {
                                        reference: "62x",
                                        libelle: {
                                            value: "Services bancaires, autres",
                                        },
                                        montant: {
                                            ht: 755,
                                        },
                                    },
                                ],
                                montant: {
                                    ht: 15714,
                                },
                            },
                            {
                                reference: "63",
                                libelle: {
                                    value: "63 - Impôts et taxes",
                                },
                                lignes: [
                                    {
                                        reference: "631",
                                        libelle: {
                                            value: "Impôts et taxes sur rémunération",
                                        },
                                    },
                                    {
                                        reference: "635",
                                        libelle: {
                                            value: "Autres impôts et taxes",
                                        },
                                    },
                                ],
                            },
                            {
                                reference: "64",
                                libelle: {
                                    value: "64 - Charges de personnel",
                                },
                                lignes: [
                                    {
                                        reference: "641",
                                        libelle: {
                                            value: "Rémunération des personnels",
                                        },
                                        montant: {
                                            ht: 64202,
                                        },
                                    },
                                    {
                                        reference: "645",
                                        libelle: {
                                            value: "Charges sociales",
                                        },
                                        montant: {
                                            ht: 27761,
                                        },
                                    },
                                    {
                                        reference: "647",
                                        libelle: {
                                            value: "Autres charges de personnel",
                                        },
                                        montant: {
                                            ht: 13481,
                                        },
                                    },
                                ],
                                montant: {
                                    ht: 105444,
                                },
                            },
                            {
                                reference: "65",
                                libelle: {
                                    value: "65 - Autres charges de gestion courante",
                                },
                                lignes: [
                                    {
                                        reference: "65x",
                                        libelle: {
                                            value: "Autres charges de gestion courante",
                                        },
                                        montant: {
                                            ht: 3687,
                                        },
                                    },
                                ],
                                montant: {
                                    ht: 3687,
                                },
                            },
                            {
                                reference: "66",
                                libelle: {
                                    value: "66 - Charges financières",
                                },
                                lignes: [
                                    {
                                        reference: "66x",
                                        libelle: {
                                            value: "Charges financières",
                                        },
                                        montant: {
                                            ht: 83,
                                        },
                                    },
                                ],
                                montant: {
                                    ht: 83,
                                },
                            },
                            {
                                reference: "67",
                                libelle: {
                                    value: "67 - Charges exceptionnelles",
                                },
                                lignes: [
                                    {
                                        reference: "67x",
                                        libelle: {
                                            value: "Charges exceptionnelles",
                                        },
                                    },
                                ],
                            },
                            {
                                reference: "68",
                                libelle: {
                                    value: "68 - Dotation aux amortissements",
                                },
                                lignes: [
                                    {
                                        reference: "68x",
                                        libelle: {
                                            value: "Dotation aux amortissements",
                                        },
                                    },
                                ],
                            },
                            {
                                reference: "69",
                                libelle: {
                                    value: "69 - Impôt sur les bénéfices (IS) ; Participation des salariés",
                                },
                                lignes: [
                                    {
                                        reference: "69x",
                                        libelle: {
                                            value: "Impôt sur les bénéfices (IS) ; Participation des salariés",
                                        },
                                    },
                                ],
                            },
                            {
                                reference: "CHARGINDIRECT",
                                libelle: {
                                    value: "Charges indirectes",
                                },
                                lignes: [
                                    {
                                        reference: "chgfixe",
                                        libelle: {
                                            value: "Charges fixes de fonctionnement",
                                        },
                                    },
                                    {
                                        reference: "fraisfin",
                                        libelle: {
                                            value: "Frais financiers",
                                        },
                                    },
                                    {
                                        reference: "autchgindirect",
                                        libelle: {
                                            value: "Autres charges indirectes",
                                        },
                                    },
                                    {
                                        reference: "excprev",
                                        libelle: {
                                            value: "Exédent prévisionnel (bénéfice)",
                                        },
                                    },
                                ],
                            },
                            {
                                reference: "86",
                                libelle: {
                                    value: "86 - Emplois des contributions volontaires en nature",
                                },
                                lignes: [
                                    {
                                        reference: "860",
                                        libelle: {
                                            value: "860 - Secours en nature",
                                        },
                                    },
                                    {
                                        reference: "861",
                                        libelle: {
                                            value: "861 - Mise à disposition gratuite de biens et services",
                                        },
                                    },
                                    {
                                        reference: "862",
                                        libelle: {
                                            value: "862 - Prestations",
                                        },
                                    },
                                    {
                                        reference: "864",
                                        libelle: {
                                            value: "864 - Personnel bénévole",
                                        },
                                        montant: {
                                            ht: 116000,
                                        },
                                    },
                                ],
                                montant: {
                                    ht: 116000,
                                },
                            },
                        ],
                        montant: {
                            ht: 257112,
                            total: 257112,
                        },
                    },
                    recette: {
                        postes: [
                            {
                                reference: "MGS_POSTE_FICTIF",
                                lignes: [
                                    {
                                        reference: "MGS_LIGNE_FICTIVE",
                                        financement: {
                                            statut: "TRANSMITTED",
                                            statutLabel: "Transmise",
                                        },
                                    },
                                ],
                            },
                            {
                                reference: "70",
                                libelle: {
                                    value: "70 - Vente de produits finis, de marchandises, prestations de services",
                                },
                                lignes: [
                                    {
                                        reference: "70x",
                                        libelle: {
                                            value: "Vente de produits finis, de marchandises, prestations de services",
                                        },
                                        financement: {},
                                    },
                                ],
                            },
                            {
                                reference: "73",
                                libelle: {
                                    value: "73 - Dotations et produits de tarification",
                                },
                                lignes: [
                                    {
                                        reference: "73x",
                                        libelle: {
                                            value: "Dotations et produits de tarification",
                                        },
                                        financement: {},
                                    },
                                ],
                            },
                            {
                                reference: "74",
                                libelle: {
                                    value: "74 - Subventions d'exploitation",
                                },
                                lignes: [
                                    {
                                        reference: "74fe",
                                        libelle: {
                                            value: "Fonds européens (FSE, FEDER, etc.)",
                                        },
                                        financement: {},
                                    },
                                    {
                                        reference: "74agenceserv",
                                        libelle: {
                                            value: "L'agence de services et de paiement (emplois aidés)",
                                        },
                                        financement: {},
                                        montant: {
                                            ht: 8500,
                                        },
                                    },
                                    {
                                        reference: "74aidespriv",
                                        libelle: {
                                            value: "Aides privées (NOM_ASSO)",
                                        },
                                        financement: {},
                                    },
                                    {
                                        reference: "74x",
                                        libelle: {
                                            value: "Autres établissements publics",
                                        },
                                        financement: {},
                                    },
                                ],
                                sousPostes: [
                                    {
                                        reference: "74etat",
                                        libelle: {
                                            value: "Etat : préciser le(s) ministère(s) sollicité(s), directions ou services déconcentrés sollicités",
                                        },
                                        lignes: [
                                            {
                                                libelle: {
                                                    value: "02-ETAT-POLITIQUE-VILLE",
                                                },
                                                montant: {
                                                    ht: 0,
                                                },
                                                reference: "3rDYXaFG2FX",
                                                financement: {
                                                    financeur: {
                                                        title: "02-ETAT-POLITIQUE-VILLE",
                                                        typeFinanceur: "FINANCEURPRIVILEGIE",
                                                        groupesGestion: [
                                                            {
                                                                href: "/account-management/cget-agents/groups/DIRDPTAIS-GG",
                                                                title: "POLITIQUE-VILLE-02-AISNE",
                                                            },
                                                        ],
                                                        reference: "41ijz-FoKB",
                                                    },
                                                    statut: "UNACCEPTABLE",
                                                    statutLabel: "Non recevable",
                                                },
                                                avisPriseEnCharge: {
                                                    tiers: {
                                                        title: "02-ETAT-POLITIQUE-VILLE",
                                                    },
                                                    avis: "FAVORABLE",
                                                    date: "2022-08-18T07:25:32.413Z",
                                                    user: {
                                                        title: "Christian Douglas",
                                                    },
                                                },
                                                gestionnaire: {
                                                    title: "Christian Douglas",
                                                },
                                                avisRecevabilite: {
                                                    user: {
                                                        title: "Christian Douglas",
                                                    },
                                                    montantPropose: {
                                                        ht: 0,
                                                    },
                                                    avis: "IRRECEVABLE",
                                                    date: "2022-08-17T22:00:00.000Z",
                                                    commentaire: "COMMENTAIRE",
                                                },
                                            },
                                            {
                                                commentaire: "Un jeune un mentor ",
                                                libelle: {
                                                    value: "MINISTERE-EDUCATION-NATIONALE",
                                                },
                                                montant: {
                                                    ht: 48535,
                                                },
                                                reference: "3rDZ3bjTlBZ",
                                                financement: {
                                                    financeur: {
                                                        title: "MINISTERE-EDUCATION-NATIONALE",
                                                        typeFinanceur: "AUTREFINANCEUR",
                                                        reference: "4yWNCvLtvKS",
                                                    },
                                                },
                                            },
                                            {
                                                commentaire: "cordées",
                                                libelle: {
                                                    value: "PROVENCE-ALPES-COTE-AZUR-EDUC (RECTORAT)",
                                                },
                                                montant: {
                                                    ht: 11400,
                                                },
                                                reference: "3rDZdhnQkcN",
                                                financement: {
                                                    financeur: {
                                                        title: "PROVENCE-ALPES-COTE-AZUR-EDUC (RECTORAT)",
                                                        typeFinanceur: "PARTENAIREFINANCIER",
                                                        reference: "DYMcU_T85AxB",
                                                    },
                                                },
                                            },
                                            {
                                                libelle: {
                                                    value: "13-ETAT-POLITIQUE-VILLE",
                                                },
                                                montant: {
                                                    ht: 7000,
                                                },
                                                reference: "3yyS8a1xBsY",
                                                financement: {
                                                    financeur: {
                                                        title: "13-ETAT-POLITIQUE-VILLE",
                                                        typeFinanceur: "FINANCEURPRIVILEGIE",
                                                        groupesGestion: [
                                                            {
                                                                href: "/account-management/cget-agents/groups/DIRDPTBOR-GG",
                                                                title: "POLITIQUE-VILLE-13-BOUCHES-DU-RHONE",
                                                            },
                                                        ],
                                                        reference: "NkeMofdKoFH",
                                                    },
                                                    statut: "VOTE",
                                                    source: {
                                                        href: "/connecteur-aides-v9v8/api/tenants/cget/dossiersFinancement/DAREF_ADMINISTRATIVE",
                                                    },
                                                    dispositif: {
                                                        title: "v8 - Action de demande",
                                                    },
                                                    montantVote: {
                                                        ht: 7000,
                                                    },
                                                    dateDecision: "2022-09-07T22:00:00.000Z",
                                                    statutLabel: "Votée",
                                                },
                                                avisPriseEnCharge: {
                                                    tiers: {
                                                        title: "13-ETAT-POLITIQUE-VILLE",
                                                    },
                                                    avis: "FAVORABLE",
                                                    date: "2022-09-07T09:52:51.119Z",
                                                    user: {
                                                        title: "Sophie Cluz",
                                                    },
                                                },
                                                gestionnaire: {
                                                    title: "Sophie Cluz",
                                                },
                                                avisRecevabilite: {
                                                    user: {
                                                        title: "Sophie Cluz",
                                                    },
                                                    montantPropose: {
                                                        ht: 7000,
                                                    },
                                                    avis: "RECEVABLE",
                                                    date: "2022-03-10T23:00:00.000Z",
                                                },
                                            },
                                        ],
                                        montant: {
                                            total: 66935,
                                            ht: 66935,
                                        },
                                    },
                                    {
                                        reference: "74region",
                                        libelle: {
                                            value: "Conseil-s Régional(aux)",
                                        },
                                        lignes: [
                                            {
                                                libelle: {
                                                    value: "PROVENCE ALPES COTE AZUR (CONSEIL REGIO)",
                                                },
                                                montant: {
                                                    ht: 23000,
                                                },
                                                reference: "3rDZunjDzbp",
                                                financement: {
                                                    financeur: {
                                                        title: "PROVENCE ALPES COTE AZUR (CONSEIL REGIO)",
                                                        typeFinanceur: "PARTENAIREFINANCIER",
                                                        reference: "4kIbjy4KPYH",
                                                    },
                                                },
                                            },
                                        ],
                                        montant: {
                                            total: 23000,
                                            ht: 23000,
                                        },
                                    },
                                    {
                                        reference: "74dep",
                                        libelle: {
                                            value: "Conseil-s Départemental (aux)",
                                        },
                                        lignes: [
                                            {
                                                commentaire: "5000 droit commun + 4000 cdv ",
                                                libelle: {
                                                    value: "13-BOUCHES-DU-RHONE (DEPT)",
                                                },
                                                montant: {
                                                    ht: 9000,
                                                },
                                                reference: "3rDZAs4wtwq",
                                                financement: {
                                                    financeur: {
                                                        title: "13-BOUCHES-DU-RHONE (DEPT)",
                                                        typeFinanceur: "FINANCEURPRIVILEGIE",
                                                        groupesGestion: [
                                                            {
                                                                href: "/account-management/cget-agents/groups/DEP013-GG",
                                                                title: "13-BOUCHES-DU-RHONE",
                                                            },
                                                        ],
                                                        reference: "VybuuBtPtB",
                                                    },
                                                    statut: "SUPPORTED",
                                                    statutLabel: "Prise en charge",
                                                },
                                                avisPriseEnCharge: {
                                                    tiers: {
                                                        title: "13-BOUCHES-DU-RHONE (DEPT)",
                                                    },
                                                    avis: "FAVORABLE",
                                                    commentaire: "Traitement de CLOTURE 2022",
                                                    date: "2023-01-31T21:39:00.790Z",
                                                    user: {
                                                        title: "Integration internal-solution",
                                                    },
                                                },
                                            },
                                        ],
                                        montant: {
                                            total: 9000,
                                            ht: 9000,
                                        },
                                    },
                                    {
                                        reference: "74epci",
                                        libelle: {
                                            value: "Communautés de communes ou d'agglomérations",
                                        },
                                        montant: {
                                            total: 0,
                                        },
                                    },
                                    {
                                        reference: "74com",
                                        libelle: {
                                            value: "Commune(s)",
                                        },
                                        lignes: [
                                            {
                                                commentaire: "1600 droit commun + 7500 cdv ",
                                                libelle: {
                                                    value: "AIX EN PROVENCE (13616)",
                                                },
                                                montant: {
                                                    ht: 9100,
                                                },
                                                reference: "3rDZLiMJRUD",
                                                financement: {
                                                    financeur: {
                                                        title: "AIX EN PROVENCE (13616)",
                                                        typeFinanceur: "FINANCEURPRIVILEGIE",
                                                        groupesGestion: [
                                                            {
                                                                href: "/account-management/cget-agents/groups/COM013AIXENP-GG",
                                                                title: "AIX EN PROVENCE (13616)",
                                                            },
                                                        ],
                                                        reference: "NJpOkZ9LPFH",
                                                    },
                                                    statut: "SUPPORTED",
                                                    statutLabel: "Prise en charge",
                                                },
                                                avisPriseEnCharge: {
                                                    tiers: {
                                                        title: "AIX EN PROVENCE (13616)",
                                                    },
                                                    avis: "FAVORABLE",
                                                    commentaire: "Traitement de CLOTURE 2022",
                                                    date: "2023-01-31T21:39:01.618Z",
                                                    user: {
                                                        title: "Integration internal-solution",
                                                    },
                                                },
                                            },
                                        ],
                                        montant: {
                                            total: 9100,
                                            ht: 9100,
                                        },
                                    },
                                    {
                                        reference: "74orgasoc",
                                        libelle: {
                                            value: "Organismes sociaux (CAF, etc. détailler)",
                                        },
                                        lignes: [
                                            {
                                                libelle: {
                                                    value: "13-CAF",
                                                },
                                                montant: {
                                                    ht: 1890,
                                                },
                                                reference: "3rDZY7ycUpl",
                                                financement: {
                                                    financeur: {
                                                        title: "13-CAF",
                                                        typeFinanceur: "FINANCEURPRIVILEGIE",
                                                        groupesGestion: [
                                                            {
                                                                href: "/account-management/cget-agents/groups/CAF013-GG",
                                                                title: "CAF-13-BOUCHES-DU-RHONE",
                                                            },
                                                        ],
                                                        reference: "4yBpq7PFvKr",
                                                    },
                                                    statut: "SUPPORTED",
                                                    statutLabel: "Prise en charge",
                                                },
                                                avisPriseEnCharge: {
                                                    tiers: {
                                                        title: "13-CAF",
                                                    },
                                                    avis: "FAVORABLE",
                                                    commentaire: "Traitement de CLOTURE 2022",
                                                    date: "2023-01-31T21:39:02.527Z",
                                                    user: {
                                                        title: "Integration internal-solution",
                                                    },
                                                },
                                            },
                                        ],
                                        montant: {
                                            total: 1890,
                                            ht: 1890,
                                        },
                                    },
                                ],
                                montant: {
                                    ht: 118425,
                                },
                            },
                            {
                                reference: "75",
                                libelle: {
                                    value: "75 - Autres produits de gestion courante",
                                },
                                lignes: [
                                    {
                                        reference: "756",
                                        libelle: {
                                            value: "756.Cotisations",
                                        },
                                        financement: {},
                                    },
                                    {
                                        reference: "758",
                                        libelle: {
                                            value: "758.Dons manuels - Mécénat",
                                        },
                                        financement: {},
                                    },
                                    {
                                        reference: "750",
                                        libelle: {
                                            value: "750.Autres produits de gestion courante",
                                        },
                                        financement: {},
                                    },
                                ],
                            },
                            {
                                reference: "76",
                                libelle: {
                                    value: "76 - Produits financiers",
                                },
                                lignes: [
                                    {
                                        reference: "76x",
                                        libelle: {
                                            value: "Produits financiers",
                                        },
                                        financement: {},
                                    },
                                ],
                            },
                            {
                                reference: "77",
                                libelle: {
                                    value: "77 - Produits exceptionnels",
                                },
                                lignes: [
                                    {
                                        reference: "77x",
                                        libelle: {
                                            value: "Produits exceptionnels",
                                        },
                                        financement: {},
                                    },
                                ],
                            },
                            {
                                reference: "78",
                                libelle: {
                                    value: "78 - Reprises sur amortissements et provisions",
                                },
                                lignes: [
                                    {
                                        reference: "78x",
                                        libelle: {
                                            value: "789 - Report de ressources affectées et non utilisées sur des exercices antérieurs",
                                        },
                                        financement: {},
                                    },
                                ],
                            },
                            {
                                reference: "79",
                                libelle: {
                                    value: "79 - Transfert de charges",
                                },
                                lignes: [
                                    {
                                        reference: "79x",
                                        libelle: {
                                            value: "Transfert de charges",
                                        },
                                        financement: {},
                                    },
                                ],
                            },
                            {
                                reference: "RESSPROPRES",
                                libelle: {
                                    value: "Ressources propres affectées au projet",
                                },
                                lignes: [
                                    {
                                        reference: "insufprevisionnel",
                                        libelle: {
                                            value: "Autofinancement (insuffisance prévisionnelle)",
                                        },
                                        financement: {},
                                        montant: {
                                            ht: 22687,
                                        },
                                    },
                                ],
                                montant: {
                                    ht: 22687,
                                },
                            },
                            {
                                reference: "87",
                                libelle: {
                                    value: "87 - Contributions volontaires en nature",
                                },
                                lignes: [
                                    {
                                        reference: "870",
                                        libelle: {
                                            value: "870 - Bénévolat",
                                        },
                                        financement: {},
                                        montant: {
                                            ht: 116000,
                                        },
                                    },
                                    {
                                        reference: "871",
                                        libelle: {
                                            value: "871 - Prestations en nature",
                                        },
                                        financement: {},
                                    },
                                    {
                                        reference: "875",
                                        libelle: {
                                            value: "875 - Dons en nature",
                                        },
                                        financement: {},
                                    },
                                ],
                                montant: {
                                    ht: 116000,
                                },
                            },
                        ],
                        montant: {
                            ht: 257112,
                            total: 257112,
                        },
                    },
                    periode: {
                        exercice: 2022,
                    },
                    reference: "cftPEGVLir",
                    active: true,
                    current: true,
                },
            ],
            multiFinanceur: true,
            multiFinancement: {
                financeurs: [
                    {
                        href: "URL_REF_TIER/41ijz-FoKB",
                        title: "02-ETAT-POLITIQUE-VILLE",
                        typeFinanceur: "FINANCEURPRIVILEGIE",
                        groupesGestion: [],
                        lignePlanFinancement: {},
                        montant: {
                            ht: 0,
                        },
                        reference: "41ijz-FoKB",
                    },
                    {
                        href: "URL_REF_TIER/4yWNCvLtvKS",
                        title: "MINISTERE-EDUCATION-NATIONALE",
                        typeFinanceur: "AUTREFINANCEUR",
                        lignePlanFinancement: {},
                        montant: {
                            ht: 48535,
                        },
                        reference: "4yWNCvLtvKS",
                    },
                    {
                        href: "URL_REF_TIER/DYMcU_T85AxB",
                        title: "PROVENCE-ALPES-COTE-AZUR-EDUC (RECTORAT)",
                        typeFinanceur: "PARTENAIREFINANCIER",
                        lignePlanFinancement: {},
                        montant: {
                            ht: 11400,
                        },
                        reference: "DYMcU_T85AxB",
                    },
                    {
                        href: "URL_REF_TIER/NkeMofdKoFH",
                        title: "13-ETAT-POLITIQUE-VILLE",
                        typeFinanceur: "FINANCEURPRIVILEGIE",
                        groupesGestion: [],
                        lignePlanFinancement: {},
                        montant: {
                            ht: 7000,
                        },
                        reference: "NkeMofdKoFH",
                    },
                    {
                        href: "URL_REF_TIER/4kIbjy4KPYH",
                        title: "PROVENCE ALPES COTE AZUR (CONSEIL REGIO)",
                        typeFinanceur: "PARTENAIREFINANCIER",
                        lignePlanFinancement: {},
                        montant: {
                            ht: 23000,
                        },
                        reference: "4kIbjy4KPYH",
                    },
                    {
                        href: "URL_REF_TIER/VybuuBtPtB",
                        title: "13-BOUCHES-DU-RHONE (DEPT)",
                        typeFinanceur: "FINANCEURPRIVILEGIE",
                        groupesGestion: [],
                        lignePlanFinancement: {
                            href: "/referentiel-financement/api/tenants/cget/demandes-financement/REF_FINANCEMENT/planFinancement/recette/lignes/3rDZAs4wtwq",
                            reference: "3rDZAs4wtwq",
                        },
                        montant: {
                            ht: 9000,
                        },
                        reference: "VybuuBtPtB",
                    },
                    {
                        href: "URL_REF_TIER/NJpOkZ9LPFH",
                        title: "AIX EN PROVENCE (13616)",
                        typeFinanceur: "FINANCEURPRIVILEGIE",
                        groupesGestion: [],
                        lignePlanFinancement: {},
                        montant: {
                            ht: 9100,
                        },
                        reference: "NJpOkZ9LPFH",
                    },
                    {
                        href: "URL_REF_TIER/4yBpq7PFvKr",
                        title: "13-CAF",
                        typeFinanceur: "FINANCEURPRIVILEGIE",
                        groupesGestion: [],
                        lignePlanFinancement: {},
                        montant: {
                            ht: 1890,
                        },
                        reference: "4yBpq7PFvKr",
                    },
                ],
            },
            optionsMultiFinanceur: {
                modePreInstruction: "PARTAGE",
            },
            criteresEligibilite: [
                {
                    reponseAttendue: true,
                    reference: "crit1",
                    libelle: {
                        value: "Sollicitez-vous un financement au titre de la politique de la ville ?",
                    },
                    reponseSaisie: true,
                },
            ],
            eligible: true,
            gestionnaire: {},
            title: "TITLE -- ASSOCIATION DE LA NOM_ASSO",
            domiciliationBancaire: {},
            frequence: "RENOUVELLEMENT",
            nature: "PROJET_ACTION",
            periode: "PONCTUELLE",
            contrat: {},
            intituleProjet: "INTITULE_PROJET",
            localisations: [],
            contributionsPourModification: [],
            signataire: {},
            periodeRealisation: {
                dateDebut: "2022-08-31T22:00:00.000Z",
                dateFin: "2023-08-30T22:00:00.000Z",
            },
            moyensHumains: {
                description:
                    "10 volontaires en service civique. 290 bénévoles sont nécessaires pour la mise en œuvre de ce programme.",
            },
            user: {
                title: "internal-solution-integration",
            },
            justification: {},
            viewsValues: {},
            completudePiece: true,
            groupesGestion: [],
            justificationStatus: "JUSTIFIED",
            localisationsByLevels: {},
            demandesComplementPieces: [],
            demandesReport: [],
            contributionsRedirection: [],
            contributionsAvis: [],

            dosFinCount: 0,
            _document: {},
        },
        gispro: {
            ej: "2103814945",
            dauphinId: "DAREF_ADMINISTRATIVE",
            siret: DEFAULT_ASSOCIATION.siret,
            provider: "Gispro",
        },
    },
];
