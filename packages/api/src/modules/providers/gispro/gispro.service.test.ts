import GisproRequestAdapter from './adapters/GisproRequestAdapter';
import gisproService from './gispro.service';
// import gisproRepository from "./repositories/gispro.repository";

const MONGO_ID = "ID";
// const findByMongoIdMock = jest.spyOn(gisproRepository, "findById");
const toDemandeSubventionMock = jest.spyOn(GisproRequestAdapter, "toDemandeSubvention");

describe("GisproService", () => {
    beforeAll(() => {
        // @ts-expect-error: mock
        toDemandeSubventionMock.mockImplementation(entity => entity);
    })

    afterAll(() => {
        toDemandeSubventionMock.mockRestore();
    })

    describe("getDemandeSubventionById", () => {
        // it("should return null if given ID does not match any document", async () => {
        //     findByMongoIdMock.mockImplementationOnce(async () => null);
        //     const expected = null;
        //     const actual = await gisproService.getDemandeSubventionById(MONGO_ID);
        //     expect(actual).toEqual(expected);
        // });
        
        // it("should call GisproRequestAdapter.toDemandeSubvention", async () => {
        //     const entity = { siret: "000000001"};
        //     // @ts-expect-error: mock
        //     findByMongoIdMock.mockImplementationOnce(async id => entity);
        //     await gisproService.getDemandeSubventionById(MONGO_ID);
        //     expect(GisproRequestAdapter.toDemandeSubvention).toHaveBeenCalledWith(entity);
        // })

        it("should return null because not implemented", async () => {
            const expected =  new Error("getDemandeSubventionById() is not implemented for Gispro provider");
            let actual;
            try {
                actual = await gisproService.getDemandeSubventionById(MONGO_ID);
            } catch (e) {
                actual = e
            }
            expect(actual).toEqual(expected);
        })
    })
});