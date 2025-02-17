import type { vi } from "vitest";
import type { AmountsVsProgramRegionDto } from "dto";
import { TableAmountsVsProgramRegionController } from "./TableAmountsVsProgramRegion.controller";

import { DTO, DTO_FORMATTED, VARS, HEADERS_ALL } from "./__fixtures__/TableAmountsVsProgramRegion.fixture";

describe("TableAmountsVsProgramRegionController", () => {
    let controller: TableAmountsVsProgramRegionController;

    beforeAll(() => {
        controller = new TableAmountsVsProgramRegionController(DTO as AmountsVsProgramRegionDto[]);
    });

    describe("_formatData", () => {
        it("should return the right format for montant", () => {
            //@ts-expect-error private method
            const actual = controller._formatData(DTO);
            expect(actual).toEqual(DTO_FORMATTED);
        });
    });

    describe("_groupAndSum", () => {
        it("should return grouped data when colSelected = ['programme']", () => {
            const expected = [
                {
                    exerciceBudgetaire: DTO[0].exerciceBudgetaire,
                    programme: DTO[0].programme,
                    montant: DTO[0].montant + DTO[1].montant,
                },
                {
                    exerciceBudgetaire: DTO[2].exerciceBudgetaire,
                    programme: DTO[2].programme,
                    montant: DTO[2].montant,
                },
            ];
            //@ts-expect-error : private method
            const actual = controller._groupAndSum(DTO, [VARS.PROGRAMME]);
            expect(actual).toEqual(expected);
        });

        it("should return grouped data when colSelected = ['regionAttachementComptable']", () => {
            const expected = [
                {
                    exerciceBudgetaire: DTO[0].exerciceBudgetaire,
                    regionAttachementComptable: DTO[0].regionAttachementComptable,
                    montant: DTO[0].montant + DTO[2].montant,
                },
                {
                    exerciceBudgetaire: DTO[1].exerciceBudgetaire,
                    regionAttachementComptable: DTO[1].regionAttachementComptable,
                    montant: DTO[1].montant,
                },
            ];
            //@ts-expect-error : private method
            const actual = controller._groupAndSum(DTO, ["regionAttachementComptable"]);
            expect(actual).toEqual(expected);
        });

        it("should return DTO if colSelected = ['regionAttachementComptable', 'programme']", () => {
            const amountsVsProgramRegionData = [
                { ...DTO[0], mission: "mission 1" },
                { ...DTO[1], mission: "mission 2" },
            ];

            const expected = [DTO[0], DTO[1]];
            //@ts-expect-error : private method
            const actual = controller._groupAndSum(amountsVsProgramRegionData, [
                VARS.PROGRAMME,
                VARS.REGION_ATTACHEMENT_COMPTABLE,
            ]);
            expect(actual).toEqual(expected);
        });
    });

    describe("getHeaders", () => {
        it("should return right headers when colSelected = ['programme']", () => {
            const expected = HEADERS_ALL.filter(
                item => item !== controller.headersMapping[VARS.REGION_ATTACHEMENT_COMPTABLE],
            );
            const actual = controller.getHeaders([VARS.PROGRAMME]);
            expect(actual).toEqual(expected);
        });

        it("should return right headers when colSelected = ['regionAttachementComptable']", () => {
            const expected = HEADERS_ALL.filter(item => item !== controller.headersMapping[VARS.PROGRAMME]);
            const actual = controller.getHeaders([VARS.REGION_ATTACHEMENT_COMPTABLE]);
            expect(actual).toEqual(expected);
        });

        it("should return all headers when colSelected = ['regionAttachementComptable', 'programme']", () => {
            const expected = HEADERS_ALL;
            const actual = controller.getHeaders([VARS.PROGRAMME, VARS.REGION_ATTACHEMENT_COMPTABLE]);
            expect(actual).toEqual(expected);
        });
    });

    describe("getTableData", () => {
        let mockGroupAndSum;
        let mockFormatData;
        let mockFilterYears;
        beforeAll(() => {
            //@ts-expect-error : private method
            mockGroupAndSum = vi.spyOn(controller, "_groupAndSum").mockReturnValue([DTO[0]] as any);
            //@ts-expect-error : private method
            mockFilterYears = vi.spyOn(controller, "_filterYears").mockReturnValue([DTO[0]] as any);
            //@ts-expect-error : private method
            mockFormatData = vi.spyOn(controller, "_formatData").mockReturnValue([]);
        });
        afterAll(() => {
            mockGroupAndSum.mockRestore();
            mockFormatData.mockRestore();
            mockFilterYears.mockRestore();
        });

        it("should call _GroupAndSum with the right parameters", () => {
            controller.getTableData(DTO as AmountsVsProgramRegionDto[], [VARS.PROGRAMME]);
            expect(mockGroupAndSum).toHaveBeenCalledWith(DTO, [VARS.PROGRAMME]);
        });

        it("should call _formatData with the right parameter", () => {
            controller.getTableData(DTO as AmountsVsProgramRegionDto[], [VARS.PROGRAMME]);
            expect(mockFormatData).toHaveBeenCalledWith([DTO[0]]);
        });
    });

    describe("filterYears", () => {
        it("should return only data with exerciceBudgetaire >= yearMin and different from current year", () => {
            const groupedData = [
                { ...DTO[0], exerciceBudgetaire: 2025 },
                { ...DTO[2], exerciceBudgetaire: 2021 },
                { ...DTO[2], exerciceBudgetaire: 2023 },
                { ...DTO[1], exerciceBudgetaire: 2020 },
            ];

            const expected = [groupedData[1], groupedData[2]];
            //@ts-expect-error : private method
            const actual = controller._filterYears(groupedData, 2021);
            expect(actual).toEqual(expected);
        });
    });
});
