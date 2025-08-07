import OsirisParser from "../../modules/providers/osiris/osiris.parser";
import osirisService from "../../modules/providers/osiris/osiris.service";
import OsirisCli from "./Osiris.cli";

jest.mock("../../modules/providers/osiris/osiris.parser");
jest.mock("../../modules/providers/osiris/osiris.service");

describe("Osiris cli", () => {
    let cli: OsirisCli;

    beforeEach(() => {
        cli = new OsirisCli();
    });

    describe.each`
        resourceType  | methodToTest       | parserMethod                  | validateMethod                       | bulkAddMethod
        ${"requests"} | ${"_parseRequest"} | ${OsirisParser.parseRequests} | ${osirisService.validateAndComplete} | ${osirisService.bulkAddRequest}
        ${"actions"}  | ${"_parseAction"}  | ${OsirisParser.parseActions}  | ${osirisService.validAction}         | ${osirisService.bulkAddActions}
    `("parse $resourceType", ({ resourceType, methodToTest, parserMethod, validateMethod, bulkAddMethod }) => {
        const CONTENT_FILE = Buffer.from("toto");
        const YEAR = 1789;
        const DOCS = ["entity1", "entity2"];

        beforeAll(() => {
            parserMethod.mockReturnValue(DOCS);
            if (resourceType === "requests") validateMethod.mockImplementation(r => Promise.resolve(r));
            else validateMethod.mockReturnValue(true);
        });

        it("calls parser with content file", async () => {
            await cli[methodToTest](CONTENT_FILE, YEAR, []);
            expect(parserMethod).toHaveBeenCalledWith(CONTENT_FILE, YEAR);
        });

        it("validates all documents", async () => {
            await cli[methodToTest](CONTENT_FILE, YEAR, []);
            expect(validateMethod).toHaveBeenCalledWith(DOCS[0]);
            expect(validateMethod).toHaveBeenCalledWith(DOCS[1]);
        });

        it("saves validated documents", async () => {
            if (resourceType === "requests")
                validateMethod.mockRejectedValueOnce({ validation: { message: "toto", data: "data" } });
            else validateMethod.mockReturnValueOnce(false);

            await cli[methodToTest](CONTENT_FILE, YEAR, []);
            expect(bulkAddMethod).toHaveBeenCalledWith([DOCS[1]]);
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
