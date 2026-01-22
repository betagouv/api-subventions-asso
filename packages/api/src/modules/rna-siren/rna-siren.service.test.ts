import RnaSirenEntity from "../../entities/RnaSirenEntity";
import { ASSOCIATION_IDENTIFIER } from "../../identifierObjects/__fixtures__/IdentifierFixture";
import rnaSirenService from "./rna-siren.service";

describe("RnaSirenService", () => {
    describe("insertManyAssociationIdentifer", () => {
        let mockInsertMany: jest.SpyInstance;

        beforeEach(() => {
            mockInsertMany = jest.spyOn(rnaSirenService, "insertMany").mockImplementation(jest.fn());
        });

        afterAll(() => {
            mockInsertMany.mockRestore();
        });

        it("tranform AssociationIdentifiers into RnaSirenEntities", () => {
            rnaSirenService.insertManyAssociationIdentifer([ASSOCIATION_IDENTIFIER]);
            expect(mockInsertMany).toHaveBeenCalledWith([
                new RnaSirenEntity(ASSOCIATION_IDENTIFIER.rna, ASSOCIATION_IDENTIFIER.siren),
            ]);
        });
    });
});
