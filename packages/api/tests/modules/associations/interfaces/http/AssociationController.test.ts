import request from "supertest"
import getUserToken from "../../../../__helpers__/getUserToken";
import associationService from "../../../../../src/modules/associations/associations.service"

const g = global as unknown as { app: unknown }

const ASSOCIATION_RNA = "W123456789";

describe("AssociationController", () => {

    beforeEach(() => {
        jest.spyOn(associationService, 'getSubventions')
    })

    describe("GET /association/{RNA_NUMBER}/subventions", () => {
        describe("on error", () => {
            const ERROR_MESSAGE = "This is an Error message";
            
            it("should return 404 when an error occur", async () => {
                (associationService.getSubventions as jest.Mock).mockImplementation(() => { throw new Error(); });
                const actual = (await request(g.app)
                    .get(`/association/${ASSOCIATION_RNA}/subventions`)
                    .set("x-access-token", await getUserToken())
                    .set('Accept', 'application/json')).statusCode
                
                expect(actual).toBe(404);
            })

            it("should return an object when an error occur", async () => {
                (associationService.getSubventions as jest.Mock).mockImplementation(async () => { throw new Error(ERROR_MESSAGE); });
                const expected = { success: false, message: ERROR_MESSAGE}
                const actual = (await request(g.app)
                    .get(`/association/${ASSOCIATION_RNA}/subventions`)
                    .set("x-access-token", await getUserToken())
                    .set('Accept', 'application/json')).body;
                
                expect(actual).toEqual(expected);
            })
        })

        describe("on success", () => {
            const SUBVENTIONS = ["subventions"];
            beforeAll(() => {
                (associationService.getSubventions as jest.Mock).mockImplementation(() => SUBVENTIONS);
            })
            it("should return 200", async () => {
                const actual = (await request(g.app)
                    .get(`/association/${ASSOCIATION_RNA}/subventions`)
                    .set("x-access-token", await getUserToken())
                    .set('Accept', 'application/json')).statusCode
    
                expect(actual).toBe(200)
            });

            it("should return an object with subventions", async () => {
                const expected = { success: true, subventions: SUBVENTIONS};
                const actual = (await request(g.app)
                    .get(`/association/${ASSOCIATION_RNA}/subventions`)
                    .set("x-access-token", await getUserToken())
                    .set('Accept', 'application/json')).body

                expect(actual).toEqual(expected);
            })
        })
        
    })
})