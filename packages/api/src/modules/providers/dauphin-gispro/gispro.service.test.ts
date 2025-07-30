import gisproService from "./gispro.service";
import GisproParser from "./gispro.parser";
import gisproPort from "../../../dataProviders/db/providers/gispro.port";
import GisproEntity from "./@types/GisproEntity";

jest.mock("./gispro.parser");
jest.mock("../../../dataProviders/db/providers/gispro.port");

describe("gispro service", () => {
    describe("parseSaveXls", () => {
        const FILE_CONTENT = "content" as unknown as Buffer;
        const EXERCISE = 2004;
        const ENTITIES = "entities" as unknown as GisproEntity[];

        beforeAll(() => {
            jest.mocked(GisproParser.parse).mockReturnValue(ENTITIES);
        });
        afterAll(() => {
            jest.mocked(GisproParser.parse).mockRestore();
        });

        it("calls parser to get entities", async () => {
            await gisproService.parseSaveXls(FILE_CONTENT, EXERCISE);
            expect(GisproParser.parse).toHaveBeenCalledWith(FILE_CONTENT, EXERCISE);
        });

        it("calls port with entities to upsert them", async () => {
            await gisproService.parseSaveXls(FILE_CONTENT, EXERCISE);
            expect(gisproPort.upsertMany).toHaveBeenCalledWith(ENTITIES);
        });
    });
});
