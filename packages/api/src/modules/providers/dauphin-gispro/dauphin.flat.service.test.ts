import dauphinFlatService from "./dauphin.flat.service";
import dauphinPort from "../../../dataProviders/db/providers/dauphin/dauphin.port";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";
import { ReadableStream } from "stream/web";
import { FindCursor, WithId } from "mongodb";
import { SimplifiedJoinedDauphinGispro } from "./@types/SimplifiedDauphinGispro";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";
import DauphinDtoAdapter, { InconsistentAggregationError } from "./adapters/DauphinDtoAdapter";

jest.mock("../../../dataProviders/db/providers/dauphin/dauphin.port");
jest.mock("../../applicationFlat/applicationFlat.service");
jest.mock("../../applicationFlat/applicationFlat.helper");
jest.mock("./adapters/DauphinDtoAdapter", () => {
    const actualAdapterModule = jest.requireActual("./adapters/DauphinDtoAdapter");
    return {
        __esModule: true, // Use it when dealing with esModules
        default: { simplifiedJoinedToApplicationFlat: jest.fn() },
        InconsistentAggregationError: actualAdapterModule.InconsistentAggregationError,
    };
});

describe("dauphin flat service", () => {
    describe("generateTempJoinedCollection", () => {
        it("calls port dauphin create simplifies collection", async () => {
            await dauphinFlatService.generateTempJoinedCollection();
            expect(dauphinPort.createSimplifiedDauphinBeforeJoin);
        });

        it("calls port gispo join", async () => {
            await dauphinFlatService.generateTempJoinedCollection();
            expect(dauphinPort.joinGisproToSimplified);
        });
    });

    describe("feedApplicationFlat", () => {
        let generateTempCollectionSpy: jest.SpyInstance;
        let saveFlatSpy: jest.SpyInstance;
        const CURSOR = {} as unknown as FindCursor<WithId<SimplifiedJoinedDauphinGispro>>;
        const STREAM = {} as unknown as ReadableStream<ApplicationFlatEntity>;
        const SIMPLIFIED = "simplified" as unknown as WithId<SimplifiedJoinedDauphinGispro>;
        const ADAPTED = "adapted" as unknown as ApplicationFlatEntity;
        const AGG_ERROR = new InconsistentAggregationError("", [], undefined, []);

        beforeEach(() => {
            generateTempCollectionSpy = jest
                .spyOn(dauphinFlatService, "generateTempJoinedCollection")
                .mockResolvedValue();
            saveFlatSpy = jest.spyOn(dauphinFlatService, "saveApplicationsFromStream").mockResolvedValue();
            jest.mocked(dauphinPort.findAllTempCursor).mockReturnValue(CURSOR);
            jest.mocked(cursorToStream).mockReturnValue(STREAM);
            jest.mocked(DauphinDtoAdapter.simplifiedJoinedToApplicationFlat).mockReturnValue(ADAPTED);
        });

        afterEach(() => {
            generateTempCollectionSpy.mockRestore();
            saveFlatSpy.mockRestore();
        });

        it("generates temp collection", async () => {
            await dauphinFlatService.feedApplicationFlat();
            expect(generateTempCollectionSpy).toHaveBeenCalled();
        });

        it("get cursor from temp collection", async () => {
            await dauphinFlatService.feedApplicationFlat();
            expect(dauphinPort.findAllTempCursor).toHaveBeenCalled();
        });

        it("calls cursor to stream", async () => {
            await dauphinFlatService.feedApplicationFlat();
            expect(cursorToStream).toHaveBeenCalledWith(CURSOR, expect.any(Function));
        });

        describe("cursor to stream adapter", () => {
            let adapterToTest: (entity: WithId<SimplifiedJoinedDauphinGispro>) => ApplicationFlatEntity | null;

            beforeAll(async () => {
                await dauphinFlatService.feedApplicationFlat();
                adapterToTest = jest.mocked(cursorToStream).mock.calls[0][1];
            });

            it("calls adapter", () => {
                adapterToTest(SIMPLIFIED);
                expect(DauphinDtoAdapter.simplifiedJoinedToApplicationFlat).toHaveBeenCalledWith(SIMPLIFIED);
            });

            it("returns adapted values", () => {
                const expected = ADAPTED;
                const actual = adapterToTest(SIMPLIFIED);
                expect(actual).toEqual(expected);
            });

            it("returns null if InconsistentAggregationError is raised", () => {
                jest.mocked(DauphinDtoAdapter.simplifiedJoinedToApplicationFlat).mockImplementationOnce(() => {
                    throw AGG_ERROR;
                });
                const actual = adapterToTest(SIMPLIFIED);
                expect(actual).toBeNull();
            });

            it("throws back other errors", () => {
                const RANDOM_ERROR = new Error("random");
                jest.mocked(DauphinDtoAdapter.simplifiedJoinedToApplicationFlat).mockImplementationOnce(() => {
                    throw RANDOM_ERROR;
                });
                let actual = undefined;
                try {
                    adapterToTest(SIMPLIFIED);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (e: any) {
                    actual = e;
                }
                expect(actual).toEqual(RANDOM_ERROR);
            });
        });

        it("saves flat from built stream", async () => {
            await dauphinFlatService.feedApplicationFlat();
            expect(saveFlatSpy).toHaveBeenCalledWith(STREAM);
        });

        it("logs errors from InconsistentAggregationError", async () => {
            jest.mocked(cursorToStream).mockImplementationOnce((_c, adapter) => {
                adapter(SIMPLIFIED);
                adapter(SIMPLIFIED);
                adapter(SIMPLIFIED);
                return STREAM;
            });
            const logSpy = jest.spyOn(console, "log");
            jest.mocked(DauphinDtoAdapter.simplifiedJoinedToApplicationFlat).mockImplementationOnce(() => {
                throw new InconsistentAggregationError("field1", ["val1.1", "val1.2"], "codeDossier1", ["refAdmin1"]);
            });
            jest.mocked(DauphinDtoAdapter.simplifiedJoinedToApplicationFlat).mockReturnValueOnce(ADAPTED);
            jest.mocked(DauphinDtoAdapter.simplifiedJoinedToApplicationFlat).mockImplementationOnce(() => {
                throw new InconsistentAggregationError("field2", ["val2.1", "val2.2"], "codeDossier2", [
                    "refAdmin2.1",
                    "refAdmin2.2",
                ]);
            });
            await dauphinFlatService.feedApplicationFlat();
            const actual = logSpy.mock.calls.at(-1);
            expect(actual).toMatchSnapshot();
        });

        it("cleans temp collection if no InconsistentAggregationError was risen", async () => {
            await dauphinFlatService.feedApplicationFlat();
            expect(dauphinPort.cleanTempCollection).toHaveBeenCalled();
        });
    });

    describe("savesFlatFromStream", () => {
        it("calls applicationFlat service", async () => {
            const STREAM = {} as unknown as ReadableStream<ApplicationFlatEntity>;
            await dauphinFlatService.saveApplicationsFromStream(STREAM);
            expect(applicationFlatService.saveFromStream).toHaveBeenCalledWith(STREAM);
        });
    });
});
