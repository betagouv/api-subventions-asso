import request from "supertest"
import getUserToken from "../../../../__helpers__/getUserToken";
import demandeSubventionsService from "../../../../../src/modules/demandes_subventions/demandes_subventions.service"

const g = global as unknown as { app: unknown }

const ETABLISSEMENT_SIRET = "12345678901234"

describe("EtablissementController", () => {

    beforeEach(() => {
        jest.spyOn(demandeSubventionsService, 'getByEtablissement')
    })

    describe("GET /etablissement/{SIRET_NUMBER}/subventions", () => {
        describe("on error", () => {
            const ERROR_MESSAGE = "This is an error message";

            it("should return 404 when an error occur", async () => {
                (demandeSubventionsService.getByEtablissement as jest.Mock).mockImplementation(() => { throw new Error()});
                const actual = (await request(g.app)
                    .get(`/etablissement/${ETABLISSEMENT_SIRET}/subventions`)
                    .set("x-access-token", await getUserToken())
                    .set('Accept', 'application/json')).statusCode
                
                expect(actual).toBe(404);
            })

            it("should return an object when an error occur", async () => {
                (demandeSubventionsService.getByEtablissement as jest.Mock).mockImplementation(() => { throw new Error(ERROR_MESSAGE) });
                const expected = { success: false, message: ERROR_MESSAGE}
                const actual = (await request(g.app)
                    .get(`/etablissement/${ETABLISSEMENT_SIRET}/subventions`)
                    .set("x-access-token", await getUserToken())
                    .set('Accept', 'application/json')).body;
                
                expect(actual).toEqual(expected);
            })
        })

        describe("on success", () => {
            const SUBVENTIONS = ["subventions"];
            beforeAll(() => {
                (demandeSubventionsService.getByEtablissement as jest.Mock).mockImplementation(() => SUBVENTIONS);
            })
            it("should return 200", async () => {
                const actual = (await request(g.app)
                    .get(`/etablissement/${ETABLISSEMENT_SIRET}/subventions`)
                    .set("x-access-token", await getUserToken())
                    .set('Accept', 'application/json')).statusCode
    
                expect(actual).toBe(200)
            });

            it("should return an object with subventions", async () => {
                const expected = { success: true, subventions: SUBVENTIONS};
                const actual = (await request(g.app)
                    .get(`/etablissement/${ETABLISSEMENT_SIRET}/subventions`)
                    .set("x-access-token", await getUserToken())
                    .set('Accept', 'application/json')).body

                expect(actual).toEqual(expected);
            })
        })
        
    })
})