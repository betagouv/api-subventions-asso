import { DTO } from "../../__fixtures__/AmountsVsProgramRegion.fixture";
import { AmountsVsYearController } from "./AmountsVsYear.controller";

describe("AmountsVsYearController", () => {
    let controller: AmountsVsYearController;

    beforeAll(() => {
        controller = new AmountsVsYearController(DTO);
    });

    describe("_filterData", () => {
        it("should return not filtered data if both parameters are equal to 'region-all' and 'program-all'", () => {
            //@ts-expect-error private method
            const actual = controller._filterData(DTO, "region-all", "program-all");
            const expected = DTO;
            expect(actual).toEqual(expected);
        });

        it("should return data filtered on region if selectedRegion is different from 'region-all'", () => {
            //@ts-expect-error private method
            const actual = controller._filterData(DTO, "region-0", "program-all");
            const expected = [DTO[0], DTO[2]];
            expect(actual).toEqual(expected);
        });

        it("should return data filtered on program if selectedProgram is different from 'program-all'", () => {
            //@ts-expect-error private method
            const actual = controller._filterData(DTO, "region-all", "program-0");
            const expected = [DTO[0], DTO[1]];
            expect(actual).toEqual(expected);
        });

        it("should return data filtered on region and program if are different from 'region-all' and 'program-all'", () => {
            //@ts-expect-error private method
            const actual = controller._filterData(DTO, "region-0", "program-0");
            const expected = [DTO[0]];
            expect(actual).toEqual(expected);
        });
    });

    describe("_getRegionOptions", () => {
        it("should return all regions and Tous", () => {
            //@ts-expect-error private method
            const actual = controller._getRegionOptions(DTO);
            const expected = [
                { value: "region-0", label: "Occitanie" },
                { value: "region-1", label: "Nord" },
                { value: "region-all", label: "Tous" },
            ];
            expect(actual).toEqual(expected);
        });
    });

    describe("_getProgramOptions", () => {
        it("should return all programs and Tous", () => {
            //@ts-expect-error private method
            const actual = controller._getProgramOptions(DTO);
            const expected = [
                { value: "program-0", label: "120-Programme" },
                { value: "program-1", label: "124-Programme" },
                { value: "program-all", label: "Tous" },
            ];
            expect(actual).toEqual(expected);
        });
    });
});
