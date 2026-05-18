import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";
import OsirisParser from "./osiris.parser";
import osirisService from "../../../../modules/providers/osiris/osiris.service";
import OsirisCli from "./osiris.cli";
import OsirisActionMapper from "./osiris-action.mapper";
import OsirisActionDto, { OsirisActionRawData } from "./osiris-action.dto";

jest.mock("./osiris.parser");
jest.mock("./osiris-action.mapper");
jest.mock("../../../../modules/providers/osiris/osiris.service");

describe("Osiris cli", () => {
    let cli: OsirisCli;

    beforeEach(() => {
        cli = new OsirisCli();
        jest.clearAllMocks();
    });

    describe("parse requests", () => {
        const CONTENT_FILE = Buffer.from("toto");
        const YEAR = 1789;
        const RAW_ROWS = [
            {
                Dossier: { "N° Dossier Osiris": "DD75-24-0001" },
                Association: { "N° Siret": "12345678900001" },
            },
            {
                Dossier: { "N° Dossier Osiris": "DD75-24-0002" },
                Association: { "N° Siret": "12345678900002" },
            },
        ];

        beforeEach(() => {
            jest.mocked(OsirisParser.parseRequests).mockReturnValue(RAW_ROWS);
            jest.mocked(osirisService.validateAndComplete).mockImplementation(r => Promise.resolve(r));
        });

        it("calls parser with content file", async () => {
            await cli._parseRequest(CONTENT_FILE, YEAR, []);
            expect(OsirisParser.parseRequests).toHaveBeenCalledWith(CONTENT_FILE);
        });

        it("validates all mapped documents", async () => {
            await cli._parseRequest(CONTENT_FILE, YEAR, []);
            expect(osirisService.validateAndComplete).toHaveBeenCalledWith(
                expect.objectContaining({
                    dossier: expect.objectContaining({
                        exerciceBudgetaire: YEAR,
                        osirisId: "DD75-24-0001",
                    }),
                }),
            );
            expect(osirisService.validateAndComplete).toHaveBeenCalledWith(
                expect.objectContaining({
                    dossier: expect.objectContaining({
                        exerciceBudgetaire: YEAR,
                        osirisId: "DD75-24-0002",
                    }),
                }),
            );
        });

        it("saves validated documents", async () => {
            jest.mocked(osirisService.validateAndComplete).mockRejectedValueOnce({
                validation: { message: "toto", data: "data" },
            });

            await cli._parseRequest(CONTENT_FILE, YEAR, []);
            expect(osirisService.bulkAddRequest).toHaveBeenCalledWith([
                expect.objectContaining({
                    dossier: expect.objectContaining({
                        osirisId: "DD75-24-0002",
                    }),
                }),
            ]);
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
        });

        it("calls parser with content file and year", async () => {
            await cli._parseAction(CONTENT_FILE, YEAR, []);
            expect(OsirisParser.parseActions).toHaveBeenCalledWith(CONTENT_FILE, YEAR);
        });

        it("maps raw data to DTOs", async () => {
            await cli._parseAction(CONTENT_FILE, YEAR, []);
            expect(OsirisActionMapper.toDto).toHaveBeenCalledWith(RAW_DATA[0]);
            expect(OsirisActionMapper.toDto).toHaveBeenCalledWith(RAW_DATA[1]);
        });

        it("maps DTOs to entities with year", async () => {
            await cli._parseAction(CONTENT_FILE, YEAR, []);
            expect(OsirisActionMapper.toEntity).toHaveBeenCalledWith(DTOS[0], YEAR);
            expect(OsirisActionMapper.toEntity).toHaveBeenCalledWith(DTOS[1], YEAR);
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
