jest.mock("../helper");
jest.mock("../../../store/modal.store", () => ({
    modal: { update: jest.fn() },
    data: { update: jest.fn() },
}));
import * as modalStore from "../../../store/modal.store";
import SubventionTableController from "./SubventionTable.controller";
import SubventionInfoModal from "@components/SubventionsVersementsDashboard/Modals/SubventionInfoModal.svelte";
import SubventionsAdapter from "@resources/subventions/subventions.adapter";

describe("SubventionTableController", () => {
    describe("extractHeaders()", () => {
        it("return an array of header", () => {
            const actual = SubventionTableController.extractHeaders();
            expect(actual).toMatchSnapshot();
        });
    });

    describe("extractRows()", () => {
        const mockToSubvention = jest.spyOn(SubventionsAdapter, "toSubvention");
        beforeAll(() =>
            mockToSubvention.mockImplementation(
                jest.fn(() => ({
                    serviceInstructeur: undefined,
                    dispositif: undefined,
                    projectName: undefined,
                    montantsDemande: undefined,
                    montantsAccordeOrStatus: undefined,
                })),
            ),
        );
        afterAll(() => mockToSubvention.mockRestore());
        it("should call SubventionsAdapter.toSubvention for each element in array", () => {
            SubventionTableController.extractRows([{ subvention: {} }, { subvention: {} }]);
            expect(mockToSubvention).toHaveBeenCalledTimes(2);
        });

        it("should not call SubventionsAdapter.toSubvention if no subvention", () => {
            SubventionTableController.extractRows([{ subvention: {} }, {}]);
            expect(mockToSubvention).toHaveBeenCalledTimes(1);
        });

        it("should return an array", () => {
            const expected = [null, null];
            const actual = SubventionTableController.extractRows([{}, {}]);
            expect(actual).toEqual(expected);
        });
    });

    describe("onRowClick", () => {
        const elementData = {
            hasMoreInfo: true,
            subvention: {},
        };

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
