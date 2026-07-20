import MongoAdapter from "../MongoAdapter";
import { SIRENE_ESTABLISHMENT_DTO } from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.fixture";
import sireneEstablishmentAdapter from "./sirene-establishment.adapter";

describe("SireneEstablishmentAdapter", () => {
    const mockCreateIndex = jest.fn();
    const mockBulkWrite = jest.fn();

    beforeAll(() => {
        jest
            // @ts-expect-error: test
            .spyOn(MongoAdapter.prototype, "collection", "get")
            // @ts-expect-error: test
            .mockReturnValue({
                createIndex: mockCreateIndex,
                bulkWrite: mockBulkWrite,
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

    describe("upsertMany", () => {
        it("does not call bulkWrite with empty batch", async () => {
            await sireneEstablishmentAdapter.upsertMany([]);
            expect(mockBulkWrite).not.toHaveBeenCalled();
        });

        it("upserts unordered establishments by siret", async () => {
            await sireneEstablishmentAdapter.upsertMany([SIRENE_ESTABLISHMENT_DTO]);
            expect(mockBulkWrite).toHaveBeenCalledWith(
                [
                    {
                        updateOne: {
                            filter: { siret: SIRENE_ESTABLISHMENT_DTO.siret },
                            update: { $set: SIRENE_ESTABLISHMENT_DTO },
                            upsert: true,
                        },
                    },
                ],
                { ordered: false },
            );
        });
    });
});
