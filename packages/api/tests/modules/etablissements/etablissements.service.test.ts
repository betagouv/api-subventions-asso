import etablissementsService from "../../../src/modules/etablissements/etablissements.service";

describe("etablissements.service.ts", () => {

    describe("getEtablissementsBySiren", () => {
        it('should return etablissement data', async () => {
            const actual = await etablissementsService.getEtablissementsBySiren("517673091");
            const expected = [
                {
                    siret: [
                        {
                            value: '51767309100016',
                            provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: expect.any(Date),
                            type: 'string'
                        }
                    ],
                    adresse: [
                        {
                            value: {
                                "code_postal": "85000",
                                "numero": "10",
                                "commune": "MOUILLERON-LE-CAPTIF",
                                "type_voie": "RUE",
                                "voie": "DE LA ROCHE",
                            },
                            provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                            last_update: expect.any(Date),
                            type: 'object'
                        },
                    ],
                    "nic":  [
                        {
                            last_update: expect.any(Date),

                            "provider": "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>",
                            "type": "string",
                            "value": "00016",
                        },
                    ],
                    "ouvert":  [
                        {
                            last_update: expect.any(Date),
                            "provider": "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>",
                            "type": "boolean",
                            "value": true,
                        }
                    ],
                    "siege":  [
                        {
                            last_update: expect.any(Date),
                            "provider": "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>",
                            "type": "boolean",
                            "value": true,
                        }
                    ]
                }];
            expect(expected).toEqual(actual)
        });

        it('should return null', async () => {
            const actual = await etablissementsService.getEtablissementsBySiren("0");
            const expected = null;
            expect(expected).toEqual(actual)
        });
    })

    describe("getEtablissement", () => {
        it('should return etablissements data', async () => {
            const actual = await etablissementsService.getEtablissement("51767309100016");
            const expected = {
                siret: [
                    {
                        value: '51767309100016',
                        provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                        last_update: expect.any(Date),
                        type: 'string'
                    }
                ],
                adresse: [
                    {
                        value: {
                            "code_postal": "85000",
                            "numero": "10",
                            "commune": "MOUILLERON-LE-CAPTIF",
                            "type_voie": "RUE",
                            "voie": "DE LA ROCHE",
                        },
                        provider: '<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>',
                        last_update: expect.any(Date),
                        type: 'object'
                    },
                ],
                "nic":  [
                    {
                        last_update: expect.any(Date),

                        "provider": "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>",
                        "type": "string",
                        "value": "00016",
                    },
                ],
                "ouvert":  [
                    {
                        last_update: expect.any(Date),
                        "provider": "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>",
                        "type": "boolean",
                        "value": true,
                    }
                ],
                "siege":  [
                    {
                        last_update: expect.any(Date),
                        "provider": "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>",
                        "type": "boolean",
                        "value": true,
                    }
                ]
            };
            expect(expected).toEqual(actual)
        });

        it('should return null', async () => {
            const actual = await etablissementsService.getEtablissement("0");
            const expected = null;
            expect(expected).toEqual(actual)
        });
    })
});