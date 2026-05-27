import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";
import OsirisParser from "./osiris.parser";
import osirisService from "../../../../modules/providers/osiris/osiris.service";
import OsirisCli from "./osiris.cli";
import OsirisActionMapper from "./osiris-action.mapper";
import OsirisRequestMapper from "./osiris-request.mapper";
import OsirisActionDto, { OsirisActionRawData } from "./osiris-action.dto";
import OsirisRequestDto from "./osiris-request.dto";
import {
    InvalidOsirisRequestError,
    VALID_REQUEST_ERROR_CODE,
} from "../../../../modules/providers/osiris/osiris.errors";

jest.mock("./osiris.parser");
jest.mock("./osiris-action.mapper");
jest.mock("./osiris-request.mapper");
jest.mock("../../../../modules/providers/osiris/osiris.service");

const BULK_RESULT = {
    insertedCount: 0,
    upsertedCount: 0,
    modifiedCount: 0,
    matchedCount: 0,
};

describe("Osiris cli", () => {
    let cli: OsirisCli;

    beforeEach(() => {
        cli = new OsirisCli();
        jest.clearAllMocks();
    });

    describe("parse requests", () => {
        const CONTENT_FILE = Buffer.from("toto");
        const YEAR = 1789;
        const RAW_ROWS = ["raw1", "raw2"];
        const VALID_DTOS: OsirisRequestDto[] = [
            { dossier: { osirisId: "DD75-24-0001" }, association: { siret: "12345678900001" } },
            { dossier: { osirisId: "DD75-24-0002" }, association: { siret: "12345678900002" } },
        ];
        const ENTITIES = [
            {
                dossier: { osirisId: "DD75-24-0001", exerciceBudgetaire: YEAR },
                association: { siret: "12345678900001" },
            },
            {
                dossier: { osirisId: "DD75-24-0002", exerciceBudgetaire: YEAR },
                association: { siret: "12345678900002" },
            },
        ];

        beforeEach(() => {
            jest.mocked(OsirisParser.parseRequests).mockReturnValue(RAW_ROWS);
            jest.mocked(OsirisRequestMapper.toDto).mockImplementation(raw => VALID_DTOS[RAW_ROWS.indexOf(raw)]);
            jest.mocked(OsirisRequestMapper.toEntity).mockImplementation(dto => ENTITIES[VALID_DTOS.indexOf(dto)]);
            jest.mocked(osirisService.completeAndValidateRequest).mockImplementation(r => Promise.resolve(r));
            jest.mocked(osirisService.bulkAddRequest).mockResolvedValue(BULK_RESULT);
        });

        it("calls parser with content file", async () => {
            await cli._parseRequest(CONTENT_FILE, YEAR, []);
            expect(OsirisParser.parseRequests).toHaveBeenCalledWith(CONTENT_FILE);
        });

        it("logs invalid siret dto", async () => {
            const INVALID_DTO: OsirisRequestDto = {
                dossier: { osirisId: "DD75-24-0001" },
                association: { siret: "NOT-A-SIRET" },
            };
            jest.mocked(OsirisRequestMapper.toDto).mockReturnValueOnce(INVALID_DTO);
            const logs: unknown[] = [];
            await cli._parseRequest(CONTENT_FILE, YEAR, logs);
            expect(logs.join("")).toContain("INVALID SIRET");
        });

        it("does not validate invalid siret dto via service", async () => {
            const INVALID_DTO: OsirisRequestDto = {
                dossier: { osirisId: "DD75-24-0001" },
                association: { siret: "NOT-A-SIRET" },
            };
            jest.mocked(OsirisRequestMapper.toDto).mockReturnValueOnce(INVALID_DTO);
            await cli._parseRequest(CONTENT_FILE, YEAR, []);
            expect(jest.mocked(osirisService.completeAndValidateRequest).mock.calls.flat()).not.toContain(ENTITIES[0]);
        });

        it("rejects dto with missing osirisId and does not send it to service", async () => {
            const INVALID_DTO: OsirisRequestDto = {
                dossier: { osirisId: "" },
                association: { siret: "12345678900001" },
            };
            jest.mocked(OsirisRequestMapper.toDto).mockReturnValueOnce(INVALID_DTO);
            const logs: unknown[] = [];
            await cli._parseRequest(CONTENT_FILE, YEAR, logs);
            expect(logs.join("")).toContain("INVALID OSIRIS ID");
        });

        it("validates all valid dtos via service", async () => {
            await cli._parseRequest(CONTENT_FILE, YEAR, []);
            expect(osirisService.completeAndValidateRequest).toHaveBeenCalledTimes(VALID_DTOS.length);
        });

        it("saves validated documents", async () => {
            jest.mocked(osirisService.completeAndValidateRequest).mockRejectedValueOnce(
                new InvalidOsirisRequestError({
                    message: "toto",
                    data: "data",
                    code: VALID_REQUEST_ERROR_CODE.NOT_AN_ASSOCIATION,
                }),
            );

            await cli._parseRequest(CONTENT_FILE, YEAR, []);
            expect(osirisService.bulkAddRequest).toHaveBeenCalledWith([ENTITIES[1]]);
        });
    });

    describe("parse actions", () => {
        const CONTENT_FILE = Buffer.from("toto");
        const YEAR = 1789;
        const RAW_DATA = ["rawData1", "rawData2"] as unknown as OsirisActionRawData[];
        const DTOS: OsirisActionDto[] = [
            { dossier: { numeroActionOsiris: "DD75-23-0001-1", compteAssoId: "23-000001" } },
            { dossier: { numeroActionOsiris: "DD75-23-0002-1", compteAssoId: "23-000002" } },
        ];
        const DOCS = ["entity1", "entity2"] as unknown as OsirisActionEntity[];

        beforeEach(() => {
            jest.mocked(OsirisParser.parseActions).mockReturnValue(RAW_DATA);
            jest.mocked(OsirisActionMapper.toDto).mockImplementation(raw => DTOS[RAW_DATA.indexOf(raw)]);
            jest.mocked(OsirisActionMapper.toEntity).mockImplementation(dto => DOCS[DTOS.indexOf(dto)]);
            jest.mocked(osirisService.bulkAddActions).mockResolvedValue(BULK_RESULT);
        });

        it("calls parser with content file and year", async () => {
            await cli._parseAction(CONTENT_FILE, YEAR, []);
            expect(OsirisParser.parseActions).toHaveBeenCalledWith(CONTENT_FILE, YEAR);
        });

        it("maps raw data to DTOs", async () => {
            await cli._parseAction(CONTENT_FILE, YEAR, []);
            expect(jest.mocked(OsirisActionMapper.toDto).mock.calls).toEqual([[RAW_DATA[0]], [RAW_DATA[1]]]);
        });

        it("maps DTOs to entities with year", async () => {
            await cli._parseAction(CONTENT_FILE, YEAR, []);
            expect(jest.mocked(OsirisActionMapper.toEntity).mock.calls).toEqual([
                [DTOS[0], YEAR],
                [DTOS[1], YEAR],
            ]);
        });

        it("bulk saves all valid entities", async () => {
            await cli._parseAction(CONTENT_FILE, YEAR, []);
            expect(osirisService.bulkAddActions).toHaveBeenCalledWith(DOCS);
        });
    });

    describe("initApplicationFlat", () => {
        beforeEach(() => {
            jest.spyOn(osirisService, "initApplicationFlat").mockImplementation(jest.fn());
        });

        it("calls addApplicationFlat with requests and actions", async () => {
            await cli.initApplicationFlat();
            expect(osirisService.initApplicationFlat).toHaveBeenCalled();
        });
    });

    describe("syncApplicationsFlat", () => {
        it("calls addApplicationFlat with requests and actions", async () => {
            const EXERCISE = 2023;
            await cli.syncApplicationFlat(EXERCISE);
            expect(osirisService.syncApplicationFlat).toHaveBeenCalledWith(EXERCISE);
        });
    });
});
