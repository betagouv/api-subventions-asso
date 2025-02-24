import { DTO } from "../../__fixtures__/AmountsVsProgramRegion.fixture";
import { AmountsVsYearController } from "./AmountsVsYear.controller";

describe("AmountsVsYearController", () => {
    let controller: AmountsVsYearController;

    beforeAll(() => {
        controller = new AmountsVsYearController(DTO);
    });

    describe("_filterData", () => {
        it("should return not filtered data if both parameters are equalt to Tous", () => {
            //@ts-expect-error private method
            const actual = controller._filterData(DTO, "Tous", "Tous");
            const expected = DTO;
            expect(actual).toEqual(expected);
        });

        it("should return data filtered on region if selectedRegion is different from Tous", () => {
            //@ts-expect-error private method
            const actual = controller._filterData(DTO, "Occitanie", "Tous");
            const expected = [DTO[0], DTO[2]];
            expect(actual).toEqual(expected);
        });

        it("should return data filtered on program if selectedProgram is different from Tous", () => {
            //@ts-expect-error private method
            const actual = controller._filterData(DTO, "Tous", "120-Programme");
            const expected = [DTO[0], DTO[1]];
            expect(actual).toEqual(expected);
        });

        it("should return data filtered on region and program if both are different from Tous", () => {
            //@ts-expect-error private method
            const actual = controller._filterData(DTO, "Occitanie", "120-Programme");
            const expected = [DTO[0]];
            expect(actual).toEqual(expected);
        });
    });

    describe("_getRegionOptions", () => {
        it("should return all regions and Tous", () => {
            //@ts-expect-error private method
            const actual = controller._getRegionOptions(DTO);
            const expected = [
                { value: "Occitanie", label: "Occitanie" },
                { value: "Nord", label: "Nord" },
                { value: "Tous", label: "Tous" },
            ];
            expect(actual).toEqual(expected);
        });
    });

    describe("_getProgramOptions", () => {
        it("should return all programs and Tous", () => {
            //@ts-expect-error private method
            const actual = controller._getProgramOptions(DTO);
            const expected = [
                { value: "120-Programme", label: "120-Programme" },
                { value: "124-Programme", label: "124-Programme" },
                { value: "Tous", label: "Tous" },
            ];
            expect(actual).toEqual(expected);
        });
    });
});
