import fs from "fs";

jest.mock("fs");
const mockedFs = jest.mocked(fs);
import ChorusParser from "../../modules/providers/chorus/chorus.parser";

jest.mock("../../modules/providers/chorus/chorus.parser");
jest.mock("../../shared/helpers/CliHelper");
import chorusService from "../../modules/providers/chorus/chorus.service";

jest.mock("../../modules/providers/chorus/chorus.service");
const mockedService = jest.mocked(chorusService);
import ChorusCli from "./Chorus.cli";
import { ENTITIES } from "../../modules/providers/chorus/__fixtures__/ChorusFixtures";
import paymentFlatChorusService from "../../modules/paymentFlat/paymentFlat.chorus.service";
import { ChorusPaymentFlatEntity } from "../../modules/providers/chorus/@types/ChorusPaymentFlat";
import { FindCursor } from "mongodb";
jest.mock("../../modules/paymentFlat/paymentFlat.chorus.service");

describe("Chorus CLI", () => {
    const LOGGER = { push: jest.fn(), join: jest.fn() };

    const FILE_PATH = "../../file/path";
    const FILE_CONTENT = "HERE_MY_CONTENT";
    const NATIONAL_CHORUS_ENTITIES = [...ENTITIES];
    const EUROPEAN_CHORUS_ENTITIES = [];

    let controller: ChorusCli;

    beforeEach(() => {
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue(FILE_CONTENT);
        mockedFs.writeFileSync.mockImplementation(jest.fn());
        mockedService.insertBatchChorusLine.mockResolvedValue({ created: 100, rejected: 10 });
        ChorusParser.parse = jest
            .fn()
            .mockReturnValue({ national: NATIONAL_CHORUS_ENTITIES, european: EUROPEAN_CHORUS_ENTITIES });
        controller = new ChorusCli();
    });

    describe("persistChorusEntities", () => {
        let resyncFlatSpy: jest.SpyInstance;

        beforeEach(() => {
            resyncFlatSpy = jest.spyOn(controller, "resyncPaymentFlatByExercise").mockImplementation(jest.fn());
        });

        it("should call chorusService.insertBatchChorusLine()", async () => {
            // @ts-expect-error: test private method
            await controller.persistChorusEntities(NATIONAL_CHORUS_ENTITIES, LOGGER);
            expect(mockedService.insertBatchChorusLine).toHaveBeenCalledTimes(1);
        });

        it("saves paymentFlat entities for each exercise found in file", async () => {
            // @ts-expect-error: test private method
            await controller.persistChorusEntities(NATIONAL_CHORUS_ENTITIES, LOGGER);
            expect(resyncFlatSpy).toHaveBeenCalledWith(2022);
            expect(resyncFlatSpy).toHaveBeenCalledWith(2023);
        });
    });

    describe("persistChorusFseEntities", () => {});

    describe("_parse()", () => {
        let mockPersistChorusEntities: jest.SpyInstance;
        let mockPersistChorusFseEntities: jest.SpyInstance;

        beforeEach(() => {
            // @ts-expect-error: mock private method
            mockPersistChorusEntities = jest.spyOn(controller, "persistChorusEntities").mockResolvedValue();
            // @ts-expect-error: mock private method
            mockPersistChorusFseEntities = jest.spyOn(controller, "persistChorusFseEntities").mockResolvedValue();
        });

        it("should throw error if file is not a string", () => {
            // @ts-expect-error: test protected method
            expect(() => controller._parse(undefined, LOGGER)).rejects.toThrow(
                new Error("Parse command need file args"),
            );
        });

        it("should throw error if file is not found", () => {
            mockedFs.existsSync.mockReturnValueOnce(false);
            // @ts-expect-error: test protected method
            expect(() => controller._parse(FILE_PATH, LOGGER)).rejects.toThrow(
                new Error(`File not found ${FILE_PATH}`),
            );
        });

        it("should call ChorusParser.parse()", async () => {
            // @ts-expect-error: test protected method
            await controller._parse(FILE_PATH, LOGGER);
            expect(ChorusParser.parse).toHaveBeenCalledTimes(1);
        });

        it("should persist chorus entities", async () => {
            // @ts-expect-error: test protected method
            await controller._parse(FILE_PATH, LOGGER);
            expect(mockPersistChorusEntities).toHaveBeenCalledWith(NATIONAL_CHORUS_ENTITIES, LOGGER);
        });

        it("should persist chorus fse entities", async () => {
            // @ts-expect-error: test protected method
            await controller._parse(FILE_PATH, LOGGER);
            expect(mockPersistChorusFseEntities).toHaveBeenCalledWith(EUROPEAN_CHORUS_ENTITIES, LOGGER);
        });
    });

    describe("resyncPaymentFlatByExercise", () => {
        it("calls service updatePaymentsFlatCollection", async () => {
            const YEAR = 2022;
            await controller.resyncPaymentFlatByExercise(YEAR);
            expect(paymentFlatChorusService.updatePaymentsFlatCollection).toHaveBeenCalledWith(YEAR);
        });
    });

    describe("resetPaymentFlat", () => {
        it("checks if collection is empty of chorus results", async () => {
            jest.mocked(paymentFlatChorusService.cursorFindChorusOnly).mockReturnValueOnce({
                toArray: () => Promise.resolve([1]),
            } as unknown as FindCursor<ChorusPaymentFlatEntity>);
            await controller.resetPaymentFlat();
            expect(paymentFlatChorusService.cursorFindChorusOnly).toHaveBeenCalled();
        });

        it("calls service init", async () => {
            jest.mocked(paymentFlatChorusService.cursorFindChorusOnly).mockReturnValueOnce({
                toArray: () => Promise.resolve([1]),
            } as unknown as FindCursor<ChorusPaymentFlatEntity>);
            await controller.resetPaymentFlat();
            expect(paymentFlatChorusService.init).toHaveBeenCalledWith();
        });
    });
});
