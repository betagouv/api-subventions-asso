import fs from "fs";
import chorusService from "../../../modules/providers/chorus/chorus.service";
import ChorusCli from "./chorus.cli";
import paymentFlatChorusService from "../../../modules/payment-flat/payment-flat.chorus.service";
import { ChorusImport } from "../pipeline/import/chorus/chorus.import";
import { UpdateFlatByExercise } from "../../../modules/providers/chorus/use-cases/update-flat-by-exercise";

jest.mock("fs");
const mockedFs = jest.mocked(fs);
jest.mock("../../../shared/helpers/CliHelper");
jest.mock("../../../modules/providers/chorus/chorus.service");
jest.mock("../../../modules/payment-flat/payment-flat.chorus.service");
jest.mock("../../../modules/notify/notify.service", () => ({ notify: jest.fn().mockResolvedValue(true) }));
jest.mock("../../../modules/data-log/dataLog.service", () => ({ addFromFile: jest.fn().mockResolvedValue(undefined) }));

describe("Chorus CLI", () => {
    const LOGGER = { push: jest.fn(), join: jest.fn() };

    const FILE_PATH = "../../file/path";
    const FILE_CONTENT = "HERE_MY_CONTENT";
    const IMPORT_REPORT = { parsedCount: 100, importedCount: 80, errorCount: 20 };

    const mockChorusImport = { run: jest.fn() } as unknown as jest.Mocked<ChorusImport>;
    const mockUpdateFlatByExercise = { execute: jest.fn() } as unknown as jest.Mocked<UpdateFlatByExercise>;
    let controller: ChorusCli;

    beforeEach(() => {
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue(FILE_CONTENT);
        mockedFs.writeFileSync.mockImplementation(jest.fn());
        mockChorusImport.run.mockResolvedValue(IMPORT_REPORT);
        controller = new ChorusCli(mockChorusImport, mockUpdateFlatByExercise);
    });

    describe("_parse()", () => {
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

        it("runs chorus import", async () => {
            // @ts-expect-error: test protected method
            await controller._parse(FILE_PATH, LOGGER);
            expect(mockChorusImport.run).toHaveBeenCalledWith(FILE_CONTENT, { withoutEuropeanData: false });
        });

        it("passes --no-fse option to chorus import", async () => {
            // @ts-expect-error: test protected method
            await controller._parse(FILE_PATH, LOGGER, "--no-fse");
            expect(mockChorusImport.run).toHaveBeenCalledWith(FILE_CONTENT, { withoutEuropeanData: true });
        });

        it("returns ImportReport from chorus import", async () => {
            // @ts-expect-error: test protected method
            const result = await controller._parse(FILE_PATH, LOGGER);
            expect(result).toEqual(IMPORT_REPORT);
        });
    });

    describe("syncFlatByExercise", () => {
        it("calls use case updateFlatByExercise", async () => {
            const YEAR = 2022;
            await controller.syncFlatByExercise(String(YEAR));
            expect(mockUpdateFlatByExercise.execute).toHaveBeenCalledWith(YEAR);
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
