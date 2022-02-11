import associationsService from "../../../src/modules/associations/associations.service";

describe("associations.service.ts", () => {

    describe("getAssociationBySiren", () => {
        it('should return association data', async () => {
            const data = await associationsService.getAssociationBySiren("517673091");
            expect(data).toEqual(
                {
                    rna: {
                        value: 'W852001474',
                        provider: 'EntrepriseData <https://entreprise.data.gouv.fr>',
                        last_update: new Date("2021-10-29T01:37:37.734Z"),
                        type: 'string'
                    },
                    siren: {
                        value: '517673091',
                        provider: 'EntrepriseData <https://entreprise.data.gouv.fr>',
                        last_update: new Date("2021-10-29T01:37:37.734Z"),
                        type: 'string'
                    },
                    nic_siege: {
                        value: '00016',
                        provider: 'EntrepriseData <https://entreprise.data.gouv.fr>',
                        last_update: new Date("2021-10-29T01:37:37.734Z"),
                        type: 'string'
                    },
                    categorie_juridique: {
                        value: '9220',
                        provider: 'EntrepriseData <https://entreprise.data.gouv.fr>',
                        last_update: new Date("2021-10-29T01:37:37.734Z"),
                        type: 'string'
                    },
                    date_creation: {
                        value: new Date("2009-09-22T00:00:00.000Z"),
                        provider: 'EntrepriseData <https://entreprise.data.gouv.fr>',
                        last_update: new Date("2021-10-29T01:37:37.734Z"),
                        type: 'object'
                    },
                    date_modification: {
                        value: new Date("2021-10-29T01:37:37.734Z"),
                        provider: 'EntrepriseData <https://entreprise.data.gouv.fr>',
                        last_update: new Date("2021-10-29T01:37:37.734Z"),
                        type: 'object'
                    },
                    denomination: {
                        value: 'ASSOCIATION DEPARTEMENTALE VENDEENNE DES RESTAURANTS DU COEUR RELAIS DU COEUR',
                        provider: 'EntrepriseData <https://entreprise.data.gouv.fr>',
                        last_update: new Date("2021-10-29T01:37:37.734Z"),
                        type: 'string'
                    },
                    denominations_usuelle: {
                        value: [],
                        provider: 'EntrepriseData <https://entreprise.data.gouv.fr>',
                        last_update: new Date("2021-10-29T01:37:37.734Z"),
                        type: 'object'
                    }
                }
            
            )
        });
    })
});