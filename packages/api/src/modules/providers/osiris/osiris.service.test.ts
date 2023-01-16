import OsirisRequestAdapter from "./adapters/OsirisRequestAdapter";
import osirisService from "./osiris.service";
import { osirisRequestRepository } from "./repositories";

const MONGO_ID = "ID";
const findByMongoIdMock = jest.spyOn(osirisRequestRepository, "findByMongoId");
const toDemandeSubventionMock = jest.spyOn(OsirisRequestAdapter, "toDemandeSubvention");

describe("OsirisService", () => {
    beforeAll(() => {
        // @ts-expect-error: mock
        toDemandeSubventionMock.mockImplementation(entity => entity);
    });

    afterAll(() => {
        toDemandeSubventionMock.mockRestore();
    });

    describe("getAssociationsByRna", () => {
        const findByRnaMock = jest.spyOn(osirisRequestRepository, "findByRna");

        it("should call osirisRequestRepository.findByRna()", async () => {
            findByRnaMock.mockImplementationOnce(async () => []);
            await osirisService.getAssociationsByRna("W12345678");
        });
    });

    describe("getDemandeSubventionBySiret", () => {
        const SIRET = "12345678900000";
        const findBySiretMock = jest.spyOn(osirisService, "findBySiret");
        it("should call findBySiret()", async () => {
            // @ts-expect-error: mock
            findBySiretMock.mockImplementationOnce(jest.fn(() => [{}]));
            // @ts-expect-error: mock
            toDemandeSubventionMock.mockImplementationOnce(entity => entity);
            await osirisService.getDemandeSubventionBySiret(SIRET);
            expect(findBySiretMock).toHaveBeenCalledWith(SIRET);
        });
    });

    describe("getDemandeSubventionBySiren", () => {
        const SIREN = "123456789";
        const findBySirenMock = jest.spyOn(osirisService, "findBySiren");
        it("should call findBySiren", async () => {
            // @ts-expect-error: mock
            findBySirenMock.mockImplementationOnce(jest.fn(() => [{}]));
            // @ts-expect-error: mock
            toDemandeSubventionMock.mockImplementationOnce(entity => entity);
            await osirisService.getDemandeSubventionBySiren(SIREN);
            expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
        });
    });
});
