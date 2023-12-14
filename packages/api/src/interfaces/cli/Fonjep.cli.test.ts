import ExportDateError from "../../shared/errors/cliErrors/ExportDateError";
import FonjepCli from "./Fonjep.cli";
import FonjepParser from "../../modules/providers/fonjep/fonjep.parser";
import fonjepSubventionRepository from "../../modules/providers/fonjep/repositories/fonjep.subvention.repository";
import fonjepParserResponse from "../../modules/providers/fonjep/__fixtures__/fonjepParserResponse.json";
import fonjepService from "../../modules/providers/fonjep/fonjep.service";
jest.mock("fs");

describe("FonjepCli", () => {
    const createSubventionEntityMock = jest.spyOn(fonjepService, "createSubventionEntity");
    const createVersementEntityMock = jest.spyOn(fonjepService, "createVersementEntity");
    const useTemporyCollectionMock = jest.spyOn(fonjepService, "useTemporyCollection");
    const applyTemporyCollectionMock = jest.spyOn(fonjepService, "applyTemporyCollection");

    beforeAll(() => {
        createSubventionEntityMock.mockImplementation(async () => true);
        createVersementEntityMock.mockImplementation(async () => true);
        applyTemporyCollectionMock.mockImplementation(async () => {});
        useTemporyCollectionMock.mockImplementation(() => {});
    });

    const cli = new FonjepCli();
    describe("_parse()", () => {
        const PATH = "path/to/test";
        it("should throw ExportDateError without exportDate", async () => {
            const expected = new ExportDateError();
            let actual;
            try {
                // @ts-expect-error: protected method
                actual = await cli._parse(PATH);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });

        it("should create entities", async () => {
            const parseMock = jest.spyOn(FonjepParser, "parse");
            // @ts-expect-error: mock;
            parseMock.mockImplementationOnce(() => fonjepParserResponse);
            // @ts-expect-error: test protected method
            await cli._parse(PATH, [], new Date());
            expect(createSubventionEntityMock).toHaveBeenCalledTimes(fonjepParserResponse.subventions.length);
            expect(createVersementEntityMock).toHaveBeenCalledTimes(fonjepParserResponse.versements.length);
        });
    });
});
