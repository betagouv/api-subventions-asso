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
import { DuplicateIndexError } from "../../shared/errors/dbError/DuplicateIndexError";
import ScdlGrantParser from "../../modules/providers/scdl/scdl.grant.parser";
import MiscScdlProducer from "../../modules/providers/scdl/__fixtures__/MiscScdlProducer";

jest.mock("../../modules/providers/scdl/scdl.grant.parser");
const mockedScdlGrantParser = jest.mocked(ScdlGrantParser);

describe("ScdlCli", () => {
    const PRODUCER_ENTITY = {
        _id: new ObjectId(),
        ...MiscScdlProducer,
    };
    const GRANT = { ...MiscScdlGrant };
    const STORABLE_DATA = { ...GRANT, __data__: {} };
    const CSV_CONTENT = "CSV_CONTENT";
    const EXPORT_DATE = new Date();
    const UNIQUE_ID = "UNIQUE_ID";
    const FILE_PATH = "FILE_PATH";
    const STORABLE_DATA_ARRAY = [STORABLE_DATA];

    let cli: ScdlCli;

    beforeEach(() => {
        mockedFs.readFileSync.mockReturnValue(CSV_CONTENT);
        mockedScdlService.getProducer.mockResolvedValue(PRODUCER_ENTITY);
        // @ts-expect-error: private method
        mockedScdlService._buildGrantUniqueId.mockReturnValue(UNIQUE_ID);
        mockedScdlGrantParser.parseCsv.mockReturnValue(STORABLE_DATA_ARRAY);
        cli = new ScdlCli();
    });

    describe("addProducer()", () => {
        it("should call scdlService.createProducer()", async () => {
            mockedScdlService.getProducer.mockResolvedValue(null);
            await cli.addProducer(PRODUCER_ENTITY.slug, PRODUCER_ENTITY.name, PRODUCER_ENTITY.siret);
            expect(scdlService.createProducer).toHaveBeenCalledWith({
                slug: PRODUCER_ENTITY.slug,
                name: PRODUCER_ENTITY.name,
                siret: PRODUCER_ENTITY.siret,
                lastUpdate: expect.any(Date),
            });
        });

        it("should throw Error if no ID", () => {
            expect(() =>
                // @ts-expect-error: test purpose
                cli.addProducer(),
            ).rejects.toThrowError("producer ID is mandatory");
        });

        it("should throw Error if no NAME", () => {
            expect(() =>
                // @ts-expect-error: test purpose
                cli.addProducer(PRODUCER_ENTITY.slug),
            ).rejects.toThrowError("producer NAME is mandatory");
        });

        it("should throw Error if no SIRET", () => {
            expect(() =>
                // @ts-expect-error: test purpose
                cli.addProducer(PRODUCER_ENTITY.slug, PRODUCER_ENTITY.name),
            ).rejects.toThrowError("producer SIRET is mandatory");
        });

        it("should throw Error if SIRET is not valid", () => {
            expect(() => cli.addProducer(PRODUCER_ENTITY.slug, PRODUCER_ENTITY.name, "1234")).rejects.toThrowError(
                "SIRET is not valid",
            );
        });

        it("should throw Error if producer already exists", () => {
            expect(() =>
                cli.addProducer(PRODUCER_ENTITY.slug, PRODUCER_ENTITY.name, PRODUCER_ENTITY.siret),
            ).rejects.toThrowError("Producer already exists");
        });
    });

    describe("parse()", () => {
        afterEach(() => {
            mockedScdlGrantParser.parseCsv.mockReset();
            mockedScdlService.getProducer.mockReset();
        });

        it("should throw ExportDateError", async () => {
            expect(() => cli.parse(FILE_PATH, PRODUCER_ENTITY.slug)).rejects.toThrowError(ExportDateError);
        });

        it("should throw Error when providerId does not match any provider in database", async () => {
            mockedScdlService.getProducer.mockResolvedValue(null);
            expect(() => cli.parse(FILE_PATH, "WRONG_ID", new Date())).rejects.toThrowError();
        });

        it("should call ScdlGrantParser.parseCsv()", async () => {
            const EXPORT_DATE = new Date();
            const DELIMETER = "%";
            await cli.parse(FILE_PATH, PRODUCER_ENTITY.slug, EXPORT_DATE, DELIMETER);
            expect(ScdlGrantParser.parseCsv).toHaveBeenLastCalledWith(CSV_CONTENT, DELIMETER);
        });

        it("should call scdlService.createManyGrants()", async () => {
            await cli.parse(FILE_PATH, PRODUCER_ENTITY.slug, new Date());
            expect(scdlService.createManyGrants).toHaveBeenCalledWith(STORABLE_DATA_ARRAY, PRODUCER_ENTITY.slug);
        });

        it("if DuplicateIndexError arises, doesn't fail and logs", async () => {
            mockedScdlService.createManyGrants.mockRejectedValueOnce(
                new DuplicateIndexError("error", [1, 2, 3, 4, 5, 6]),
            );
            await cli.parse(FILE_PATH, PRODUCER_ENTITY.slug, new Date());
        });

        it("if another error arises, fail and throw it again", async () => {
            const ERROR = new Error("error");
            mockedScdlService.createManyGrants.mockRejectedValueOnce(ERROR);
            const test = () => cli.parse(FILE_PATH, PRODUCER_ENTITY.slug, new Date());
            await expect(test).rejects.toThrowError(ERROR);
        });

        it("should call scdlService.updateProducer()", async () => {
            await cli.parse(FILE_PATH, PRODUCER_ENTITY.slug, EXPORT_DATE);
            expect(scdlService.updateProducer).toHaveBeenCalledWith(PRODUCER_ENTITY.slug, { lastUpdate: EXPORT_DATE });
        });
    });
});
