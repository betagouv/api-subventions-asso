import MongoAdapter from "../MongoAdapter";
import {
    SIRENE_ESTABLISHMENT_DTO,
    SIRENE_ESTABLISHMENT_DTO_NEWER,
    SIRENE_ESTABLISHMENT_DTO_OLDER,
} from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.fixture";
import sireneEstablishmentAdapter from "./sirene-establishment.adapter";

describe("SireneEstablishmentAdapter", () => {
    const mockCreateIndex = jest.fn();
    const mockBulkWrite = jest.fn();
    const mockToArray = jest.fn();
    const mockFind = jest.fn(() => ({ toArray: mockToArray }));

    beforeAll(() => {
        jest
            // @ts-expect-error: test
            .spyOn(MongoAdapter.prototype, "collection", "get")
            // @ts-expect-error: test
            .mockReturnValue({
                createIndex: mockCreateIndex,
                bulkWrite: mockBulkWrite,
                find: mockFind,
            });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockToArray.mockResolvedValue([]);
    });

    it("uses etablissement collection", () => {
        expect(sireneEstablishmentAdapter.collectionName).toBe("etablissement");
    });

    describe("createIndexes", () => {
        it("creates unique siret index", async () => {
            await sireneEstablishmentAdapter.createIndexes();
            expect(mockCreateIndex).toHaveBeenCalledWith({ siret: 1 }, { unique: true });
        });
    });

    describe("saveNewer", () => {
        it("does not call bulkWrite with empty batch", async () => {
            await sireneEstablishmentAdapter.saveNewer([]);
            expect(mockBulkWrite).not.toHaveBeenCalled();
        });

        it("inserts missing establishment", async () => {
            await sireneEstablishmentAdapter.saveNewer([SIRENE_ESTABLISHMENT_DTO]);
            expect(mockBulkWrite.mock.calls[0][0][0].updateOne.filter).toEqual({ siret: "12345678900012" });
        });

        it("updates newer establishment", async () => {
            mockToArray.mockResolvedValueOnce([SIRENE_ESTABLISHMENT_DTO_OLDER]);
            await sireneEstablishmentAdapter.saveNewer([SIRENE_ESTABLISHMENT_DTO_NEWER]);
            expect(mockBulkWrite).toHaveBeenCalled();
        });

        it("ignores older establishment", async () => {
            mockToArray.mockResolvedValueOnce([SIRENE_ESTABLISHMENT_DTO_NEWER]);
            await sireneEstablishmentAdapter.saveNewer([SIRENE_ESTABLISHMENT_DTO_OLDER]);
            expect(mockBulkWrite).not.toHaveBeenCalled();
        });

        it("returns saved count", async () => {
            const actual = await sireneEstablishmentAdapter.saveNewer([SIRENE_ESTABLISHMENT_DTO]);
            expect(actual).toBe(1);
        });
    });
});
