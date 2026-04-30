import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";
import OsirisParser from "../../../../modules/providers/osiris/osiris.parser";
import osirisService from "../../../../modules/providers/osiris/osiris.service";
import OsirisCli from "./osiris.cli";

jest.mock("../../../../modules/providers/osiris/osiris.parser");
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
        const DTOS = [
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
            jest.mocked(OsirisParser.parseRequests).mockReturnValue(DTOS);
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
        const DOCS = ["entity1", "entity2"] as unknown as OsirisActionEntity[];

        beforeEach(() => {
            jest.mocked(OsirisParser.parseActions).mockReturnValue(DOCS);
            jest.mocked(osirisService.validAction).mockReturnValue(true);
        });

        it("calls parser with content file and year", async () => {
            await cli._parseAction(CONTENT_FILE, YEAR, []);
            expect(OsirisParser.parseActions).toHaveBeenCalledWith(CONTENT_FILE, YEAR);
        });

        it("validates all documents", async () => {
            await cli._parseAction(CONTENT_FILE, YEAR, []);
            expect(osirisService.validAction).toHaveBeenCalledWith(DOCS[0]);
            expect(osirisService.validAction).toHaveBeenCalledWith(DOCS[1]);
        });

        it("saves validated documents", async () => {
            jest.mocked(osirisService.validAction).mockReturnValueOnce(false);

            await cli._parseAction(CONTENT_FILE, YEAR, []);
            expect(osirisService.bulkAddActions).toHaveBeenCalledWith([DOCS[1]]);
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
