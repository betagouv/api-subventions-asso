import { ACTION_DBO } from "../../modules/providers/osiris/__fixtures__/osiris.action.fixtures";
import { REQUEST_DBO } from "../../modules/providers/osiris/__fixtures__/osiris.request.fixtures";
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
            cli.addApplicationsFlat = jest.fn();
            jest.spyOn(osirisService, "getAllActions").mockResolvedValue([ACTION_DBO]);
            jest.spyOn(osirisService, "getAllRequests").mockResolvedValue([REQUEST_DBO]);
        });

        it("calls addApplicationFlat with requests and actions", async () => {
            await cli.initApplicationFlat();
            expect(cli.addApplicationsFlat).toHaveBeenCalledWith([REQUEST_DBO], [ACTION_DBO]);
        });
    });

    describe("syncApplicationsFlat", () => {
        beforeEach(() => {
            cli.addApplicationsFlat = jest.fn();
            jest.spyOn(osirisService, "findActionsByExercise").mockResolvedValue([ACTION_DBO]);
            jest.spyOn(osirisService, "findRequestsByExercise").mockResolvedValue([REQUEST_DBO]);
        });

        it("calls addApplicationFlat with requests and actions", async () => {
            await cli.syncApplicationFlat(2023);
            expect(cli.addApplicationsFlat).toHaveBeenCalledWith([REQUEST_DBO], [ACTION_DBO]);
        });
    });

    describe("addApplicationsFlat", () => {
        it("calls services with actions grouped by request", async () => {
            const REQUEST_DBO_2 = {
                ...REQUEST_DBO,
                providerInformations: { ...REQUEST_DBO.providerInformations, uniqueId: "other-id" },
            };
            const ACTION_DBO_2 = {
                ...ACTION_DBO,
                indexedInformations: { ...ACTION_DBO.indexedInformations, requestUniqueId: "other-id" },
            };

            await cli.addApplicationsFlat([REQUEST_DBO, REQUEST_DBO_2], [ACTION_DBO, ACTION_DBO_2]);
            expect(osirisService.addApplicationsFlat).toHaveBeenCalledWith([
                { request: REQUEST_DBO, actions: [ACTION_DBO] },
                { request: REQUEST_DBO_2, actions: [ACTION_DBO_2] },
            ]);
        });
    });
});
