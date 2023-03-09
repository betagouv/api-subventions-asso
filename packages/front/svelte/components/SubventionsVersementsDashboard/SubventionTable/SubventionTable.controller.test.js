import * as dataHelper from "../../../helpers/dataHelper";
jest.mock("../../../helpers/dataHelper");
import * as Helper from "../helper";
jest.mock("../helper");
import SubventionTableController from "./SubventionTable.controller";

describe("SubventionTableController", () => {
    const ELEMENT = {
        subvention: [{ dispositif: "ABC DISPOSITIF", serviceInstructeur: "SERVICE INST." }]
    };

    describe("_extractTableDataFromElement()", () => {
        const mockGetProjectName = jest.spyOn(SubventionTableController, "getProjectName");
        beforeAll(() => mockGetProjectName.mockImplementation(name => name));
        it("should return an object with properties", () => {
            const expected = [
                "serviceInstructeur",
                "dispositif",
                "projectName",
                "montantsDemande",
                "montantsAccordeOrStatus"
            ];
            const actual = Object.keys(SubventionTableController._extractTableDataFromElement(ELEMENT));
            expect(actual).toEqual(expected);
        });

        it("should return an array of values", () => {
            const actual = SubventionTableController._extractTableDataFromElement(ELEMENT, true);
            expect(actual).toMatchObject([undefined, undefined, undefined, undefined, undefined]);
        });

        it("should call valueOrHyphen() multiple time", () => {
            SubventionTableController._extractTableDataFromElement(ELEMENT);
            expect(dataHelper.valueOrHyphen).toHaveBeenCalledTimes(4);
        });
    });

    describe("extractHeaders()", () => {
        it("return an array of header", () => {
            const actual = SubventionTableController.extractHeaders();
            expect(actual).toMatchSnapshot();
        });
    });

    describe("extractRows()", () => {
        const mockExtractTableDataFromElement = jest.spyOn(SubventionTableController, "_extractTableDataFromElement");
        beforeAll(() => mockExtractTableDataFromElement.mockImplementation(jest.fn()));
        afterAll(() => mockExtractTableDataFromElement.mockRestore());
        it("should call _extractTableDataFromElement for each element in array", () => {
            SubventionTableController.extractRows([{ subvention: {} }, { subvention: {} }]);
            expect(mockExtractTableDataFromElement).toHaveBeenCalledTimes(2);
        });

        it("should not call _extractTableDataFromElement if no subvention", () => {
            const actual = SubventionTableController.extractRows([{ subvention: {} }, {}]);
            expect(mockExtractTableDataFromElement).toHaveBeenCalledTimes(1);
        });

        it("should return an array", () => {
            const expected = [null, null];
            const actual = SubventionTableController.extractRows([{}, {}]);
            expect(actual).toEqual(expected);
        });
    });
});
