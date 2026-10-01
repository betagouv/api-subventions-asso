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
    const mockAggregate = jest.fn();

    const DBO = { siren: DEFAULT_ASSOCIATION.siren } as unknown as SireneEstablishmentDbo;
    const AGGREGATE_DBO = {
        siren: DEFAULT_ASSOCIATION.siren,
        nbEstabs: 2,
        postalCodes: ["75002", "75001"],
    };

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
                aggregate: mockAggregate.mockImplementation(() => ({
                    toArray: async () => [AGGREGATE_DBO],
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

    describe("getComputedFields", () => {
        it("returns sorted postal codes", async () => {
            const actual = await sireneEstablishmentAdapter.getComputedFields([DEFAULT_ASSOCIATION.siren]).toArray();
            expect(actual).toEqual([AGGREGATE_DBO]);
        });

        it("projects postal codes without null values", async () => {
            await sireneEstablishmentAdapter.getComputedFields([DEFAULT_ASSOCIATION.siren]);
            expect(mockAggregate).toHaveBeenCalledWith([
                { $match: { siren: { $in: [DEFAULT_ASSOCIATION.siren] } } },
                {
                    $group: {
                        _id: "$siren",
                        nbEstabs: {
                            $sum: 1,
                        },
                        postalCodes: { $addToSet: "$codePostalEtablissement" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        siren: "$_id",
                        nbEstabs: 1,
                        postalCodes: {
                            $filter: {
                                input: "$postalCodes",
                                as: "postalCode",
                                cond: { $ne: ["$$postalCode", null] },
                            },
                        },
                    },
                },
            ]);
        });
    });
});
