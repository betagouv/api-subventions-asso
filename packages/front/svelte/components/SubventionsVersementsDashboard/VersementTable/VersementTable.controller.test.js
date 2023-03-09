import * as dataHelper from "../../../helpers/dataHelper";
jest.mock("../../../helpers/dataHelper");
import * as dateHelper from "../../../helpers/dateHelper";
jest.mock("../../../helpers/dateHelper");
import * as Helper from "../helper";
jest.mock("../helper");
import VersementTableController from "./VersementTable.controller";

describe("VersementTableController", () => {
    const ELEMENT = {
        versements: [{ centreFinancier: "CENTRE A" }]
    };

    describe("_extractTableDataFromElement()", () => {
        const mockCountTotalVersement = jest.spyOn(VersementTableController, "countTotalVersement");
        beforeAll(() => mockCountTotalVersement.mockImplementation(jest.fn()));
        afterEach(() => mockCountTotalVersement.mockClear());
        afterAll(() => mockCountTotalVersement.mockRestore());

        it("should return an object with properties", () => {
            const actual = Object.keys(VersementTableController._extractTableDataFromElement(ELEMENT));
            expect(actual).toEqual(["totalAmount", "centreFinancier", "lastVersementDate"]);
        });

        it("should return an array of values", () => {
            const actual = VersementTableController._extractTableDataFromElement(ELEMENT, true);
            expect(actual).toEqual([undefined, undefined, undefined]);
        });

        it("should call getLastVersementsDate()", () => {
            VersementTableController._extractTableDataFromElement(ELEMENT);
            expect(Helper.getLastVersementsDate).toHaveBeenCalledTimes(1);
        });

        it("should call countTotalVersement()", () => {
            VersementTableController._extractTableDataFromElement(ELEMENT);
            expect(VersementTableController.countTotalVersement).toHaveBeenCalledTimes(1);
        });

        it("should call valueOrHyphen() twice", () => {
            VersementTableController._extractTableDataFromElement(ELEMENT);
            expect(dataHelper.valueOrHyphen).toHaveBeenCalledTimes(2);
        });

        it("should call withTwoYearDigit() ", () => {
            VersementTableController._extractTableDataFromElement(ELEMENT);
            expect(dateHelper.withTwoDigitYear).toHaveBeenCalledTimes(1);
        });
    });

    describe("extractHeaders()", () => {
        it("return an array of header", () => {
            const actual = VersementTableController.extractHeaders();
            expect(actual).toMatchSnapshot();
        });
    });

    describe("extractRows()", () => {
        const mockExtractTableDataFromElement = jest.spyOn(VersementTableController, "_extractTableDataFromElement");
        beforeAll(() => mockExtractTableDataFromElement.mockImplementation(jest.fn()));
        afterAll(() => mockExtractTableDataFromElement.mockRestore());
        it("should call _extractTableDataFromElement for each element in array", () => {
            VersementTableController.extractRows([{ versements: [] }, { versements: [] }]);
            expect(mockExtractTableDataFromElement).toHaveBeenCalledTimes(2);
        });
        it("should not call _extractTableDataFromElement if element has no versements", () => {
            VersementTableController.extractRows([{}, { versements: [] }]);
            expect(mockExtractTableDataFromElement).toHaveBeenCalledTimes(1);
        });

        it("should return an array", () => {
            const expected = [null, null];
            const actual = VersementTableController.extractRows([{}, {}]);
            expect(actual).toEqual(expected);
        });
    });
});
