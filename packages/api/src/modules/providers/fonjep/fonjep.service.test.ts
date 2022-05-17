import FonjepEntityAdapter from './adapters/FonjepEntityAdapter';
import fonjepService from './fonjep.service';
import fonjepRepository from "./repositories/fonjep.repository";

const MONGO_ID = "ID";
const findByIdMock: jest.SpyInstance<Promise<unknown>> = jest.spyOn(fonjepRepository, "findById");
const toDemandeSubventionMock = jest.spyOn(FonjepEntityAdapter, "toDemandeSubvention");

describe("FonjepService", () => {
    beforeAll(() => {
        // @ts-expect-error: mock
        toDemandeSubventionMock.mockImplementation(entity => entity);
    })

    afterAll(() => {
        toDemandeSubventionMock.mockRestore();
    })

    describe("getDemandeSubventionById", () => {
        it("should return null if given ID does not match any document", async () => {
            findByIdMock.mockImplementationOnce(async () => null);
            const expected = new Error("DemandeSubvention not found");
            let actual;
            try {
                actual = await fonjepService.getDemandeSubventionById(MONGO_ID);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });
        
        it("should call FonjepEntityAdapter.toDemandeSubvention", async () => {
            const entity = { siret: "000000001"};
            findByIdMock.mockImplementationOnce(() => Promise.resolve(entity));

            await fonjepService.getDemandeSubventionById(MONGO_ID);

            expect(FonjepEntityAdapter.toDemandeSubvention).toHaveBeenCalledWith(entity);
        })
    })
});