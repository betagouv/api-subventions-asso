import MongoAdapter from "../MongoAdapter";
import { SIRENE_ESTABLISHMENT_DTO } from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.fixture";
import sireneEstablishmentAdapter from "./sirene-establishment.adapter";
import { toEntity } from "./sirene-establishment.mapper";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import { Siren } from "../../../../identifier-objects";
import { SireneEstablishmentDbo } from "./sirene-establishment.dbo";

jest.mock("./sirene-establishment.mapper");

describe("SireneEstablishmentAdapter", () => {
    const mockCreateIndex = jest.fn();
    const mockBulkWrite = jest.fn();
    const mockFind = jest.fn();

    const DBO = { siren: DEFAULT_ASSOCIATION.siren } as unknown as SireneEstablishmentDbo;

    beforeAll(() => {
        jest
            // @ts-expect-error: test
            .spyOn(MongoAdapter.prototype, "collection", "get")
            .mockReturnValue({
                // @ts-expect-error: test
                createIndex: mockCreateIndex,
                bulkWrite: mockBulkWrite,
                find: mockFind.mockImplementation(() => ({
                    toArray: async () => [DBO],
                })),
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

    describe("getAllBySiren", () => {
        it("maps dbos to entities", async () => {
            await sireneEstablishmentAdapter.getAllBySiren(new Siren(DEFAULT_ASSOCIATION.siren));
            expect(toEntity).toHaveBeenCalledWith(DBO);
        });
    });
});
