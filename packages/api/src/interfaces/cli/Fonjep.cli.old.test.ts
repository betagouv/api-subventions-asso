import FonjepCli from "./Fonjep.cli";
import FonjepParser from "../../modules/providers/fonjep/fonjep.parser.old";
import fonjepParserResponse from "../../modules/providers/fonjep/__fixtures__old/fonjepParserResponse.json";
import fonjepService from "../../modules/providers/fonjep/fonjep.service.old";
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
