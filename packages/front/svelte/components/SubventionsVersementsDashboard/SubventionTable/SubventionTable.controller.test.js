import * as dataHelper from "../../../helpers/dataHelper";

jest.mock("../../../helpers/dataHelper");
jest.mock("../helper");
jest.mock("../../../store/modal.store", () => ({
    modal: { update: jest.fn() },
    data: { update: jest.fn() }
}));
import * as modalStore from "../../../store/modal.store";
import SubventionTableController from "./SubventionTable.controller";
import SubventionInfoModal from "@components/SubventionsVersementsDashboard/Modals/SubventionInfoModal.svelte";

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
                "montantsAccorde",
                "status",
                "showAmount"
            ];
            const actual = Object.keys(SubventionTableController._extractTableDataFromElement(ELEMENT));
            expect(actual).toEqual(expected);
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
        beforeAll(() =>
            mockExtractTableDataFromElement.mockImplementation(
                jest.fn(() => ({
                    serviceInstructeur: undefined,
                    dispositif: undefined,
                    projectName: undefined,
                    montantsDemande: undefined,
                    montantsAccordeOrStatus: undefined
                }))
            )
        );
        afterAll(() => mockExtractTableDataFromElement.mockRestore());
        it("should call _extractTableDataFromElement for each element in array", () => {
            SubventionTableController.extractRows([{ subvention: {} }, { subvention: {} }]);
            expect(mockExtractTableDataFromElement).toHaveBeenCalledTimes(2);
        });

        it("should not call _extractTableDataFromElement if no subvention", () => {
            SubventionTableController.extractRows([{ subvention: {} }, {}]);
            expect(mockExtractTableDataFromElement).toHaveBeenCalledTimes(1);
        });

        it("should return an array", () => {
            const expected = [null, null];
            const actual = SubventionTableController.extractRows([{}, {}]);
            expect(actual).toEqual(expected);
        });
    });

    describe("onRowClick", () => {
        const elementData = {
            enableButtonMoreInfo: true,
            subvention: {}
        };

        it.each`
            variableName
            ${"data"}
            ${"modal"}
        `("doesn't update modal data if nothing to show", ({ variableName }) => {
            const controller = new SubventionTableController(() => 0);
            controller.onRowClick({});
            // eslint-disable-next-line import/namespace
            expect(modalStore[variableName].update).not.toHaveBeenCalled();
        });

        it.each`
            variableName | expected
            ${"data"}    | ${{ subvention: {} }}
            ${"modal"}   | ${SubventionInfoModal}
        `("updates modal data", ({ variableName, expected }) => {
            const controller = new SubventionTableController(() => 0);
            controller.onRowClick(elementData);
            // eslint-disable-next-line import/namespace
            const actual = modalStore[variableName].update.mock.calls[0][0]();
            expect(actual).toEqual(expected);
        });
    });
});
