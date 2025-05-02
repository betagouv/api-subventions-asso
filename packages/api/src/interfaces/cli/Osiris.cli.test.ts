import OsirisParser from "../../modules/providers/osiris/osiris.parser";
import osirisService from "../../modules/providers/osiris/osiris.service";
import OsirisCli from "./Osiris.cli";

jest.mock("../../modules/providers/osiris/osiris.parser");
jest.mock("../../modules/providers/osiris/osiris.service");

describe("Osiris cli", () => {
    const cli: OsirisCli = new OsirisCli();

    describe.each`
        resourceType  | methodToTest         | parserMethod                  | validateMethod                       | bulkAddMethod
        ${"requests"} | ${cli._parseRequest} | ${OsirisParser.parseRequests} | ${osirisService.validateAndComplete} | ${osirisService.bulkAddRequest}
        ${"actions"}  | ${cli._parseAction}  | ${OsirisParser.parseActions}  | ${osirisService.validAction}         | ${osirisService.bulkAddActions}
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
            await methodToTest(CONTENT_FILE, YEAR, []);
            expect(parserMethod).toHaveBeenCalledWith(CONTENT_FILE, YEAR);
        });

        it("validates all documents", async () => {
            await methodToTest(CONTENT_FILE, YEAR, []);
            expect(validateMethod).toHaveBeenCalledWith(DOCS[0]);
            expect(validateMethod).toHaveBeenCalledWith(DOCS[1]);
        });

        it("saves validated documents", async () => {
            if (resourceType === "requests")
                validateMethod.mockRejectedValueOnce({ validation: { message: "toto", data: "data" } });
            else validateMethod.mockReturnValueOnce(false);

            await methodToTest(CONTENT_FILE, YEAR, []);
            expect(bulkAddMethod).toHaveBeenCalledWith([DOCS[1]]);
        });
    });
});
