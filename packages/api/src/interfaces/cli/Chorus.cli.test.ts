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

    let controller;

    beforeEach(() => {
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue(FILE_CONTENT);
        mockedFs.writeFileSync.mockImplementation(jest.fn());
        mockedService.insertBatchChorusLine.mockResolvedValue({ created: 100, rejected: 10 });
        ChorusParser.parse = jest.fn().mockReturnValue([...ENTITIES]);
        controller = new ChorusCli();
    });

    describe("_parse()", () => {
        let resyncFlatSpy: jest.SpyInstance;

        beforeEach(() => {
            resyncFlatSpy = jest.spyOn(controller, "resyncPaymentFlatByExercise").mockImplementation(jest.fn());
        });

        it("should throw error if file is not a string", () => {
            expect(() => controller._parse(undefined, LOGGER)).rejects.toThrowError(
                new Error("Parse command need file args"),
            );
        });

        it("should throw error if file is not found", () => {
            mockedFs.existsSync.mockReturnValueOnce(false);
            expect(() => controller._parse(FILE_PATH, LOGGER)).rejects.toThrowError(
                new Error(`File not found ${FILE_PATH}`),
            );
        });

        it("should call ChorusParser.parse()", async () => {
            await controller._parse(FILE_PATH, LOGGER);
            expect(ChorusParser.parse).toHaveBeenCalledTimes(1);
        });

        it("should call chorusService.insertBatchChorusLine()", async () => {
            await controller._parse(FILE_PATH, LOGGER);
            expect(mockedService.insertBatchChorusLine).toHaveBeenCalledTimes(1);
        });

        it("saves paymentFlat entities for each exercise found in file", async () => {
            await controller._parse(FILE_PATH, LOGGER);
            expect(resyncFlatSpy).toHaveBeenCalledWith(2022);
            expect(resyncFlatSpy).toHaveBeenCalledWith(2023);
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
