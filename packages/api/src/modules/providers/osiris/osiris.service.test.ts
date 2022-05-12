import OsirisRequestAdapter from './adapters/OsirisRequestAdapter';
import osirisService from './osiris.service';
import { osirisRepository } from './repositories';

const MONGO_ID = "ID";
const findRequestByMongoIdMock = jest.spyOn(osirisRepository, "findRequestByMongoId");
const toDemandeSubventionMock = jest.spyOn(OsirisRequestAdapter, "toDemandeSubvention");

describe("OsirisService", () => {
    beforeAll(() => {
        // @ts-expect-error: mock
        toDemandeSubventionMock.mockImplementation(entity => entity);
    })

    afterAll(() => {
        toDemandeSubventionMock.mockRestore();
    })

    describe("getDemandeSubventionById", () => {
        it("should return null if given ID does not match any document", async () => {
            findRequestByMongoIdMock.mockImplementationOnce(async () => null);
            const expected = new Error("DemandeSubvention not found");
            let actual; 
            try {
                actual = await osirisService.getDemandeSubventionById(MONGO_ID);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });
        
        it("should call OsirisRequestAdapter.toDemandeSubvention", async () => {
            const entity = { siret: "000000001"};
            // @ts-expect-error: mock
            findRequestByMongoIdMock.mockImplementationOnce(async () => entity);
            await osirisService.getDemandeSubventionById(MONGO_ID);
            expect(OsirisRequestAdapter.toDemandeSubvention).toHaveBeenCalledWith(entity);
        })
    })
});