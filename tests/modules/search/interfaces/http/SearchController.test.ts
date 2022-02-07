import request from "supertest"
import OsirisRequestEntity from "../../../../../src/modules/osiris/entities/OsirisRequestEntity";
import osirisService from "../../../../../src/modules/osiris/osiris.service";
import entrepriseApiSerivce from "../../../../../src/modules/external/entreprise-api.service";
import getUserToken from "../../../../__helpers__/getUserToken";

const g = global as unknown as { app: unknown }

describe('SearchController, /search', () => {
    const spys: jest.SpyInstance<unknown>[] = [];
    beforeAll(() => {
        spys.push(
            jest.spyOn(entrepriseApiSerivce, "findAssociationBySiren"),
            jest.spyOn(entrepriseApiSerivce, "findRnaDataByRna"),
        )
    });

    afterAll(() => {
        spys.forEach(spy => spy.mockReset());
    });


    describe("GET /siret/{SIRET_NUMBER}", () => {

        beforeEach(async () => {
            const osiris = new OsirisRequestEntity({ siret: "12345678911111", rna: "RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()}, {}, undefined, []);
            await osirisService.addRequest(osiris);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findAssociationBySiren.mockImplementationOnce((siren) => siren === "000000000" ?  null : ({ unite_legale: { 
                d: 12,
                c: 14,
                etablissements: [{
                    siret: "12345678911111"
                }]
            }}));
        })

        it("should return 200", async () => {

            const response = await request(g.app)
                .get("/search/etablissement/12345678911111")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')
    
            expect(response.statusCode).toBe(200);
        })

        it("should return data", async () => {
            const response = await request(g.app)
                .get("/search/etablissement/12345678911111")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                success: true,
                etablissement: {
                    siret: "12345678911111",
                    association: {
                        d: 12,
                        c: 14,
                    },
                    demandes_subventions: [
                        {
                            budgetLines: [],
                            indexedData: { siret: "12345678911111", rna: "RNA", name: "NAME"},
                            details: [{
                                legalInformations: { siret: "12345678911111", rna: "RNA", name: "NAME"},
                            }]
                        },    
                    ]
                }
            });
        })

        it("should return 401", async () => {
            const response = await request(g.app)
                .get("/search/etablissement/12345678911111")
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(401);
        })

        it("should return 404", async () => {
            const response = await request(g.app)
                .get("/search/etablissement/00000000000000")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(404);
        })
    })

    describe("GET /rna/{RNA_NUMBER}", () => {

        beforeEach(async () => {
            const osiris = new OsirisRequestEntity({ siret: "12345678911111", rna: "W123456789", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()}, {}, undefined, []);
            await osirisService.addRequest(osiris);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findAssociationBySiren.mockImplementationOnce((siren) => siren === "000000000" ?  null : ({ unite_legale: { 
                d: 12,
                c: 14,
                etablissements: [{
                    siret: "12345678911111",
                }]
            }}));
        })

        it("should return 200", async () => {
            const response = await request(g.app)
                .get("/search/association/W123456789")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')
    
            expect(response.statusCode).toBe(200);
        })

        it("should return data", async () => {
            const response = await request(g.app)
                .get("/search/association/W123456789")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')
            
            expect(response.statusCode).toBe(200);

            expect(response.body).toMatchObject({
                success: true,
                association: {
                    d: 12,
                    c: 14,
                    etablissements: [{
                        siret: "12345678911111",
                        demandes_subventions: [
                            {
                                budgetLines: [],
                                indexedData: { siret: "12345678911111", rna: "W123456789", name: "NAME"},
                                details: [{
                                    legalInformations: { siret: "12345678911111", rna: "W123456789", name: "NAME"},
                                }]
                            },    
                        ]
                    }]
                }
            });
        })

        it("should return 401", async () => {
            const response = await request(g.app)
                .get("/search/association/W491002657")
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(401);
        })

        it("should return 404", async () => {
            const response = await request(g.app)
                .get("/search/association/W000000000")
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(404);
        })
    })
});