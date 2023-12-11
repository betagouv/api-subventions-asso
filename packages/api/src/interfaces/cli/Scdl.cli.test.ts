import fs from "fs";
import { ObjectId } from "mongodb";
jest.mock("fs");
const mockedFs = jest.mocked(fs);
import ExportDateError from "../../shared/errors/cliErrors/ExportDateError";
import ScdlCli from "./Scdl.cli";
import scdlService from "../../modules/providers/scdl/scdl.service";
jest.mock("../../modules/providers/scdl/scdl.service");
const mockedScdlService = jest.mocked(scdlService);
import MiscScdlGrant from "../../modules/providers/scdl/__fixtures__/MiscScdlGrant";
import ScdlGrantParser from "../../modules/providers/scdl/scdl.grant.parser";
jest.mock("../../modules/providers/scdl/scdl.grant.parser");
const mockedScdlGrantParser = jest.mocked(ScdlGrantParser);

describe("ScdlCli", () => {
    const PRODUCER_ID = "PRODUCER_ID";
    const PRODUCER_NAME = "PRODUCER_NAME";
    const GRANT = { ...MiscScdlGrant };
    const CSV_CONTENT = "CSV_CONTENT";
    const PRODUCER_ENTITY = {
        _id: new ObjectId(),
        producerId: PRODUCER_ID,
        producerName: PRODUCER_NAME,
        lastUpdate: new Date(),
    };
    const EXPORT_DATE = new Date();

    const FILE_PATH = "FILE_PATH";

    let cli: ScdlCli;
    beforeEach(() => {
        mockedFs.readFileSync.mockReturnValue(CSV_CONTENT);
        mockedScdlService.getProducer.mockResolvedValue(PRODUCER_ENTITY);
        mockedScdlGrantParser.parseCsv.mockReturnValue([GRANT]);
        cli = new ScdlCli();
    });

    describe("addProducer()", () => {
        it("should call scdlService.createProducer()", async () => {
            mockedScdlService.getProducer.mockResolvedValue(null);
            await cli.addProducer(PRODUCER_ID, PRODUCER_NAME);
            expect(scdlService.createProducer).toHaveBeenCalledWith({
                producerId: PRODUCER_ID,
                producerName: PRODUCER_NAME,
                lastUpdate: expect.any(Date),
            });
        });

        it("should throw Error", () => {
            expect(() => cli.addProducer(PRODUCER_ID, PRODUCER_NAME)).rejects.toThrowError();
        });
    });

    describe("parse()", () => {
        afterEach(() => {
            mockedScdlGrantParser.parseCsv.mockReset();
            mockedScdlService.getProducer.mockReset();
        });

        it("should throw ExportDateError", async () => {
            expect(() => cli.parse(FILE_PATH, PRODUCER_ID)).rejects.toThrowError(ExportDateError);
        });

        it("should throw Error when providerId does not match any provider in database", async () => {
            mockedScdlService.getProducer.mockResolvedValue(null);
            expect(() => cli.parse(FILE_PATH, "WRONG_ID", new Date())).rejects.toThrowError();
        });

        it("should call ScdlGrantParser.parseCsv()", async () => {
            const EXPORT_DATE = new Date();
            const DELIMETER = "%";
            await cli.parse(FILE_PATH, PRODUCER_ID, EXPORT_DATE, DELIMETER);
            expect(ScdlGrantParser.parseCsv).toHaveBeenLastCalledWith(CSV_CONTENT, DELIMETER);
        });

        it("should call scdlService.createManyGrants()", async () => {
            await cli.parse(FILE_PATH, PRODUCER_ID, new Date());
            expect(scdlService.createManyGrants).toHaveBeenCalledWith([
                {
                    ...GRANT,
                    producerId: expect.any(String),
                },
            ]);
        });
        it("should call scdlService.updateProducer()", async () => {
            await cli.parse(FILE_PATH, PRODUCER_ID, EXPORT_DATE);
            expect(scdlService.updateProducer).toHaveBeenCalledWith(PRODUCER_ID, { lastUpdate: EXPORT_DATE });
        });
    });
});
