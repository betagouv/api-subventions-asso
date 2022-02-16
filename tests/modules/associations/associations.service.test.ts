import associationsService from "../../../src/modules/associations/associations.service";

describe("associations.service.ts", () => {

    describe("getAssociationBySiren", () => {
        it('should return association data', async () => {
            const data = await associationsService.getAssociationBySiren("517673091");
            expect(data).toEqual(
                {
                    rna: [
                        {
                            value: 'W852001474',
                            provider: '<Base RNA> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2022-02-10T04:01:43.000Z"),
                            type: 'string'
                        },
                        {
                            value: 'W852001474',
                            provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2021-10-29T01:37:37.734Z"),
                            type: 'string'
                        }
                    ],
                    siren: [
                        {
                            value: '517673091',
                            provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2021-10-29T01:37:37.734Z"),
                            type: 'string'
                        }
                    ],
                    nic_siege: [
                        {
                            value: '00016',
                            provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2021-10-29T01:37:37.734Z"),
                            type: 'string'
                        }
                    ],
                    categorie_juridique: [
                        {
                            value: '9220',
                            provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2021-10-29T01:37:37.734Z"),
                            type: 'string'
                        }
                    ],
                    date_creation: [
                        {
                            value: new Date("2009-09-22T00:00:00.000Z"),
                            provider: '<Base RNA> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2022-02-10T04:01:43.000Z"),
                            type: 'object'
                        },
                        {
                            value: new Date("2009-09-22T00:00:00.000Z"),
                            provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2021-10-29T01:37:37.734Z"),
                            type: 'object'
                        }
                    ],
                    date_modification: [
                        {
                            value: new Date("2021-10-29T01:37:37.734Z"),
                            provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2021-10-29T01:37:37.734Z"),
                            type: 'object'
                        }
                    ],
                    denomination: [
                        {
                            value: 'ASSOCIATION DEPARTEMENTALE VENDEENNE DES RESTAURANTS DU COEUR - RELAIS DU COEUR',
                            provider: '<Base RNA> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2022-02-10T04:01:43.000Z"),
                            type: 'string'
                        },
                        {
                            value: 'ASSOCIATION DEPARTEMENTALE VENDEENNE DES RESTAURANTS DU COEUR RELAIS DU COEUR',
                            provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2021-10-29T01:37:37.734Z"),
                            type: 'string'
                        }
                    ],
                    adresse_siege: [
                        {
                            value: {
                                "code_postal": "85000",
                                "commune": "Mouilleron-le-Captif",
                                "numero": "10",
                                "type_voie": "RUE",
                                "voie": "de La Roche,",
                            },
                            provider: '<Base RNA> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2022-02-10T04:01:43.000Z"),
                            type: 'object'
                        },
                        {
                            value: {
                                "code_postal": "85000",
                                "commune": "MOUILLERON-LE-CAPTIF",
                                "numero": "10",
                                "type_voie": "RUE",
                                "voie": "DE LA ROCHE",
                            },
                            provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2021-10-29T01:37:37.734Z"),
                            type: 'object'
                        }
                    ],
                    etablisements_siret: [
                        {
                            value: [
                                "51767309100016"
                            ],
                            provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2021-10-29T01:37:37.734Z"),
                            type: 'object'
                        }
                    ],
                    objet_social: [
                        {
                            value: "aider et apporter, sur le territoire de la Vendée, une assistance bénévole aux personnes en difficultté, en luttant contre la pauvreté et l'exclusion, notamment dans le domaine alimentaire par la distribution de denrées, et d'une manière générale par toute action d'insertion dans la vie sociale et l'activité économique, en particulier par des chantiers d'insertion assurant des productions maraîchères et agricoles et d'autre part de reconditionnement d'ordinateurs, d'électroménager et de déconstruction de matériels informatiques",
                            provider: '<Base RNA> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2022-02-10T04:01:43.000Z"),
                            type: 'string'
                        }
                    ],
                    code_objet_social_1: [
                        {
                            value: '020010',
                            provider: '<Base RNA> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2022-02-10T04:01:43.000Z"),
                            type: 'string'
                        }
                    ],
                    code_objet_social_2: [
                        {
                            value: '000000',
                            provider: '<Base RNA> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: new Date("2022-02-10T04:01:43.000Z"),
                            type: 'string'
                        }
                    ]
                }
            )
        });
    })
});