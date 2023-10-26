import fs from "fs";
jest.mock("fs");
const mockedFs = jest.mocked(fs);
import ExportDateError from "../../../../../shared/errors/cliErrors/ExportDateError";
import ScdlCliController from "./scdl.cli";
import scdlService from "../../scdl.service";
jest.mock("../../scdl.service");
const mockedScdlService = jest.mocked(scdlService);
import ScdlGrantParser from "../../scdl.grant.parser";
import MiscScdlGrant from "../../__fixtures__/MiscScdlGrant";
import { ObjectId } from "mongodb";
jest.mock("../../scdl.grant.parser");
const mockedScdlGrantParser = jest.mocked(ScdlGrantParser);

describe("ScdlCliController", () => {
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

    let cli: ScdlCliController;
    beforeEach(() => {
        mockedFs.readFileSync.mockReturnValue(CSV_CONTENT);
        mockedScdlService.getProducer.mockResolvedValue(PRODUCER_ENTITY);
        mockedScdlGrantParser.parseCsv.mockReturnValue([GRANT]);
        cli = new ScdlCliController();
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
            await cli.parse(FILE_PATH, PRODUCER_ID, EXPORT_DATE);
            expect(ScdlGrantParser.parseCsv).toHaveBeenLastCalledWith(CSV_CONTENT);
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
