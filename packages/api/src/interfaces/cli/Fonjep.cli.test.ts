import FormatDateError from "../../shared/errors/cliErrors/FormatDateError";
import FonjepCli from "./Fonjep.cli";
import FonjepParser from "../../modules/providers/fonjep/fonjep.parser";
import fonjepParserResponse from "../../modules/providers/fonjep/__fixtures__/fonjepParserResponse.json";
import fonjepService from "../../modules/providers/fonjep/fonjep.service";
jest.mock("fs");

describe("FonjepCli", () => {
    const createSubventionEntityMock = jest.spyOn(fonjepService, "createSubventionEntity");
    const createPaymentEntityMock = jest.spyOn(fonjepService, "createPaymentEntity");
    const useTemporyCollectionMock = jest.spyOn(fonjepService, "useTemporyCollection");
    const applyTemporyCollectionMock = jest.spyOn(fonjepService, "applyTemporyCollection");

    beforeAll(() => {
        createSubventionEntityMock.mockImplementation(async () => true);
        createPaymentEntityMock.mockImplementation(async () => true);
        applyTemporyCollectionMock.mockImplementation(async () => {});
        useTemporyCollectionMock.mockImplementation(() => {});
    });

    const cli = new FonjepCli();
    describe("_parse()", () => {
        const PATH = "path/to/test";
        it("should throw FormatDateError without exportDate", async () => {
            const expected = new FormatDateError();
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
            expect(createPaymentEntityMock).toHaveBeenCalledTimes(fonjepParserResponse.payments.length);
        });
    });
});
