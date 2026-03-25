import fs from "fs";
import ChorusParser from "../../modules/providers/chorus/chorus.parser";
import chorusService from "../../modules/providers/chorus/chorus.service";
import ChorusCli from "./Chorus.cli";
import { CHORUS_ENTITIES } from "../../modules/providers/chorus/__fixtures__/ChorusFixtures";
import paymentFlatChorusService from "../../modules/paymentFlat/paymentFlat.chorus.service";

jest.mock("fs");
const mockedFs = jest.mocked(fs);
jest.mock("../../modules/providers/chorus/chorus.parser");
jest.mock("../../shared/helpers/CliHelper");
jest.mock("../../modules/providers/chorus/chorus.service");
const mockedService = jest.mocked(chorusService);
jest.mock("../../modules/paymentFlat/paymentFlat.chorus.service");

describe("Chorus CLI", () => {
    const LOGGER = { push: jest.fn(), join: jest.fn() };

    const FILE_PATH = "../../file/path";
    const FILE_CONTENT = "HERE_MY_CONTENT";
    const NATIONAL_CHORUS_ENTITIES = [...CHORUS_ENTITIES];
    const EUROPEAN_CHORUS_ENTITIES = [];

    let controller: ChorusCli;

    beforeEach(() => {
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue(FILE_CONTENT);
        mockedFs.writeFileSync.mockImplementation(jest.fn());
        mockedService.insertBatchChorus.mockResolvedValue({ created: 100, rejected: 10 });
        ChorusParser.parse = jest
            .fn()
            .mockReturnValue({ national: NATIONAL_CHORUS_ENTITIES, european: EUROPEAN_CHORUS_ENTITIES });
        controller = new ChorusCli();
    });

    describe("persistChorusEntities", () => {
        let resyncFlatSpy: jest.SpyInstance;

        beforeEach(() => {
            resyncFlatSpy = jest.spyOn(controller, "resyncFlatByExercise").mockImplementation(jest.fn());
        });

        it("should call chorusService.insertBatchChorus()", async () => {
            // @ts-expect-error: test private method
            await controller.persistChorusEntities(NATIONAL_CHORUS_ENTITIES, LOGGER);
            expect(mockedService.insertBatchChorus).toHaveBeenCalledTimes(1);
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
            expect(mockPersistChorusFseEntities).toHaveBeenCalledWith(EUROPEAN_CHORUS_ENTITIES);
        });
    });

    describe("resyncPaymentFlatByExercise", () => {
        it("calls service updatePaymentsFlatCollection", async () => {
            const YEAR = 2022;
            await controller.resyncFlatByExercise(YEAR);
            expect(paymentFlatChorusService.updatePaymentsFlatCollection).toHaveBeenCalledWith(YEAR);
        });
    });

    describe("resetPaymentFlat", () => {
        it("calls old chorus service init", async () => {
            await controller.resetFlat();
            expect(paymentFlatChorusService.init).toHaveBeenCalled();
        });

        it("calls chorus init for european data", async () => {
            await controller.resetFlat();
            expect(chorusService.initFlat).toHaveBeenCalled();
        });
    });
});
