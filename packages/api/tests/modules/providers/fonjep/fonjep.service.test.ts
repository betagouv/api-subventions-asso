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
                unique_id: "unique_id",
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE"
            }, {})

            expect(fonjepService.validateEntity(entity)).toEqual({ success: true })
        });

        it("should not valid because siret is wrong", () => {
            const entity = new FonjepEntity({
                siret: "0000000000000",
                name: "Fake name"
            }, {
                unique_id: "unique_id",
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID SIRET FOR 0000000000000" })
        });

        it("should not valid because name is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: ""
            }, {
                unique_id: "unique_id",
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID NAME FOR 00000000000000" })
        });

        it("should not valid because montant_paye is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                montant_paye: undefined as unknown as number,
                unique_id: "unique_id",
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID NUMBER FOR 00000000000000" })
        });


        it("should not valid because annee_demande is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                annee_demande: undefined as unknown as number,
                unique_id: "unique_id",
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID NUMBER FOR 00000000000000" })
        });

        it("should not valid because status is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                status: undefined as unknown as string,
                unique_id: "unique_id",
                montant_paye: 500,
                service_instructeur: "XXX",
                annee_demande: 2022,
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID STRING FOR 00000000000000" })
        });


        it("should not valid because service_instructeur is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                service_instructeur: undefined as unknown as string,
                unique_id: "unique_id",
                montant_paye: 500,
                status: "En cours",
                annee_demande: 2022,
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE"
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID STRING FOR 00000000000000" })
        });

        it("should not valid because code_postal is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                unique_id: "unique_id",
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE",
                code_postal: undefined as unknown as string,
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID STRING FOR 00000000000000" })
        });

        it("should not valid because ville is wrong", () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                unique_id: "unique_id",
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE",
                ville: undefined as unknown as string,
            }, {})

            expect(fonjepService.validateEntity(entity)).toMatchObject({ success: false, "code": 1, "message": "INVALID STRING FOR 00000000000000" })
        });
    });

    describe("createEntity", () => {
        it("should create entity", async () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                unique_id: "unique_id",
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE"
            }, {})

            expect(await fonjepService.createEntity(entity)).toMatchObject({ success: true, entity, state: "created" })
            expect(await db.collection("fonjep").count()).toBe(1);
        })

        it("should not create entity", async () => {
            const entity = new FonjepEntity({
                siret: "WRONG SIRET",
                name: "Fake name"
            }, {
                unique_id: "unique_id",
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE"
            }, {})

            expect(await fonjepService.createEntity(entity)).toMatchObject({ success: false });
            expect(await db.collection("fonjep").count()).toBe(0);
        })
    })

    describe("getDemandeSubventionByRna", () => {
        it("should return null", async () => {
            const expected = null;
            const actual = await fonjepService.getDemandeSubventionByRna("FAKE_RNA");
            expect(actual).toEqual(expected);
        })
    });

    describe("getDemandeSubventionBySiret", () => {
        const now = new Date();
        beforeEach(async () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                unique_id: "unique_id",
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                updated_at: now,
                date_fin_triennale: now,
                code_postal: "75000",
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE"
            }, {})

            await fonjepService.createEntity(entity);
        })

        it("should return one entity", async () => {
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
                montants: {
                    accorde: {
                        value: 500,
                        provider: 'Fonjep',
                        last_update: now,
                        type: 'number'
                    },
                    demande: {
                        "last_update": now,
                        "provider": "Fonjep",
                        "type": "number",
                        "value": 500,
                    }
                },
                co_financement: undefined

            })]));
        })

        it("should be retrun entities", async () => {
            const entity = new FonjepEntity({
                siret: "00000000000000",
                name: "Fake name"
            }, {
                unique_id: "unique_id",
                montant_paye: 500,
                status: "En cours",
                service_instructeur: "XXX",
                annee_demande: 2022,
                updated_at: new Date(),
                date_fin_triennale: new Date(),
                code_postal: "75000",
                ville: "Paris",
                contact: "contact@beta.gouv.fr",
                type_post: "POSTE"
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