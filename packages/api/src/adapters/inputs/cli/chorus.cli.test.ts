import fs from "fs";
import chorusService from "../../../modules/providers/chorus/chorus.service";
import ChorusCli from "./chorus.cli";
import paymentFlatChorusService from "../../../modules/payment-flat/payment-flat.chorus.service";
import { ChorusImport } from "../pipeline/import/chorus/chorus.import";

jest.mock("fs");
const mockedFs = jest.mocked(fs);
jest.mock("../../../shared/helpers/CliHelper");
jest.mock("../../../modules/providers/chorus/chorus.service");
jest.mock("../../../modules/payment-flat/payment-flat.chorus.service");

describe("Chorus CLI", () => {
    const LOGGER = { push: jest.fn(), join: jest.fn() };

    const FILE_PATH = "../../file/path";
    const FILE_CONTENT = "HERE_MY_CONTENT";

    const mockChorusImport = { run: jest.fn() } as unknown as ChorusImport;
    let controller: ChorusCli;

    beforeEach(() => {
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue(FILE_CONTENT);
        mockedFs.writeFileSync.mockImplementation(jest.fn());
        controller = new ChorusCli(mockChorusImport);
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
            expect(mockChorusImport.run).toHaveBeenCalledTimes(1);
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
