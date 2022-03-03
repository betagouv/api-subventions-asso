import FonjepEntity from "../../../../src/modules/providers/fonjep/entities/FonjepRequestEntity"
import fonjepService from "../../../../src/modules/providers/fonjep/fonjep.service"
import db from "../../../../src/shared/MongoConnection";

describe("FonjepService", () => {

    describe("validateEntity", () => {

        it("should be valid entity", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            expect(fonjepService.validateEntity(entity)).toEqual({ success: true })
        });

        it("should not valid because siret is wrong", () => {
            const entity = new FonjepEntity({
                siret: "0000000000000",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID SIRET FOR 0000000000000"})
        });

        it("should not valid because name is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: ""
            }, {
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID NAME FOR 00000000000000"})
        });

        it("should not valid because montant_paye is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: undefined as unknown as number,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID NUMBER FOR 00000000000000"})
        });


        it("should not valid because annee_demande is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande:  undefined as unknown as number,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID NUMBER FOR 00000000000000"})
        });

        it("should not valid because status is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: undefined as unknown as string,
                service_instructeur: "XXX",
                annee_demande: 2022,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID STRING FOR 00000000000000"})
        });


        it("should not valid because service_instructeur is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: "xxx",
                service_instructeur: undefined as unknown as string,
                annee_demande: 2022,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID STRING FOR 00000000000000"})
        });

        it("should not valid because code_postal is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: "xxx",
                service_instructeur: "xxx",
                annee_demande: 2022,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: undefined as unknown as string,
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID CODE POSTAL FOR 00000000000000"})
        });

        it("should not valid because ville is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: "xxx",
                service_instructeur: "xxx",
                annee_demande: 2022,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: undefined as unknown as string,
                financeur_principal: "XXX"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID STRING FOR 00000000000000"})
        });

        it("should not valid because financeur_principal is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: "xxx",
                service_instructeur: "xxx",
                annee_demande: 2022,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                financeur_principal:undefined as unknown as string
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID STRING FOR 00000000000000"})
        });
    });

    describe("createEntity", () => {
        it("should create entity", async () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            expect(await fonjepService.createEntity(entity)).toMatchObject({ success: true, entity, state: "created" })
            expect(await db.collection("fonjep").count()).toBe(1);
        })

        it("should not create entity", async () => {
            const entity = new FonjepEntity({
                siret: "WRONG SIRET",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                date_versement: new Date(),
                date_fin_effet: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            expect(await fonjepService.createEntity(entity)).toMatchObject({ success: false });
            expect(await db.collection("fonjep").count()).toBe(0);
        })
    })

    describe("getDemandeSubventionBySiret", () => {
        const now =  new Date();
        beforeEach( async () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                date_versement: now,
                date_fin_effet: now,
                date_fin_triennale: now,
                code_postal: "75000",
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            await fonjepService.createEntity(entity);
        })

        it("should be retrun one entity", async () => {
            const result = await fonjepService.getDemandeSubventionBySiret("00000000000000");
            expect(result).toHaveLength(1);
            expect(result).toEqual(expect.arrayContaining([expect.objectContaining({
                service_instructeur: {
                    value: 'XXX',
                    provider: 'Fonjep',
                    last_update: now,
                    type: 'string'
                },
                status: {
                    value: 'En cours',
                    provider: 'Fonjep',
                    last_update: now,
                    type: 'string'
                },
                annee_demande: {
                    value: 2022,
                    provider: 'Fonjep',
                    last_update: now,
                    type: 'number'
                },
                financeur_principal: {
                    value: 'XXX',
                    provider: 'Fonjep',
                    last_update: now,
                    type: 'string'
                },
                montants: {
                    accorde: {
                        value: 500,
                        provider: 'Fonjep',
                        last_update: now,
                        type: 'number'
                    }
                }
            
            })]));
        })

        it("should be retrun entities", async () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                date_versement: now,
                date_fin_effet: now,
                date_fin_triennale: now,
                code_postal: "75000",
                ville: "Paris",
                financeur_principal: "XXX"
            }, {})

            await fonjepService.createEntity(entity);
            const result = await fonjepService.getDemandeSubventionBySiret("00000000000000");
            expect(result).toHaveLength(2);
        })

        it("should not retrun entities", async () => {
            const result = await fonjepService.getDemandeSubventionBySiret("00000000000001");
            expect(result).toBe(null);
        })
    });
})