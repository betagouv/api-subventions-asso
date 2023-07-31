import VersementTableController from "./VersementTable.controller";
import VersementsAdapter from "$lib/resources/versements/versements.adapter";

vi.mock("$lib/resources/versements/versements.adapter", () => ({
    default: {
        toVersement: vi.fn(() => ({
            totalAmount: undefined,
            centreFinancier: undefined,
            lastVersementDate: undefined,
        })),
    },
}));

describe("VersementTableController", () => {
    describe("extractHeaders()", () => {
        it("return an array of header", () => {
            const actual = VersementTableController.extractHeaders();
            expect(actual).toMatchSnapshot();
        });
    });

    describe("extractRows()", () => {
        it("should call _extractTableDataFromElement for each element in array", () => {
            VersementTableController.extractRows([{ versements: [{}] }, { versements: [{}] }]);
            expect(VersementsAdapter.toVersement).toHaveBeenCalledTimes(2);
        });

        it("should not call _extractTableDataFromElement if element has no versements", () => {
            VersementTableController.extractRows([{}, { versements: [{}] }]);
            expect(VersementsAdapter.toVersement).toHaveBeenCalledTimes(1);
        });

        it("should return an array", () => {
            const expected = [null, null];
            const actual = VersementTableController.extractRows([{}, {}]);
            expect(actual).toEqual(expected);
        });
    });
});
