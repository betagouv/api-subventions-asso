import MongoAdapter from "../MongoAdapter";
import { SIRENE_ESTABLISHMENT_DTO } from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.fixture";
import sireneEstablishmentAdapter from "./sirene-establishment.adapter";

describe("SireneEstablishmentAdapter", () => {
    const mockCreateIndex = jest.fn();
    const mockInsertMany = jest.fn();

    beforeAll(() => {
        jest
            // @ts-expect-error: test
            .spyOn(MongoAdapter.prototype, "collection", "get")
            // @ts-expect-error: test
            .mockReturnValue({
                createIndex: mockCreateIndex,
                insertMany: mockInsertMany,
            });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createIndexes", () => {
        it("creates unique siret index", async () => {
            await sireneEstablishmentAdapter.createIndexes();
            expect(mockCreateIndex).toHaveBeenCalledWith({ siret: 1 }, { unique: true });
        });
    });

    describe("insertMany", () => {
        it("does not call insertMany with empty batch", async () => {
            await sireneEstablishmentAdapter.insertMany([]);
            expect(mockInsertMany).not.toHaveBeenCalled();
        });

        it("inserts unordered establishments", async () => {
            await sireneEstablishmentAdapter.insertMany([SIRENE_ESTABLISHMENT_DTO]);
            expect(mockInsertMany).toHaveBeenCalledWith([SIRENE_ESTABLISHMENT_DTO], { ordered: false });
        });
    });
});
