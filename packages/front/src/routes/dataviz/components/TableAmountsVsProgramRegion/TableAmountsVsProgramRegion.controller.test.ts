import { vi } from "vitest";
import type { AmountsVsProgramRegionDto } from "dto";

import { DTO, DTO_FORMATTED, VARS, HEADERS_ALL } from "../../__fixtures__/AmountsVsProgramRegion.fixture";

import * as dataVizHelper from "../../dataViz.helper";
import { TableAmountsVsProgramRegionController } from "./TableAmountsVsProgramRegion.controller";
vi.spyOn(dataVizHelper, "groupAndSum").mockReturnValue([DTO[0]] as any);
vi.spyOn(dataVizHelper, "filterYears").mockReturnValue([DTO[0]] as any);

const A_LIST = [
    { regionAttachementComptable: "A", programme: "B", exerciceBudgetaire: 2020 },
    { regionAttachementComptable: "B", programme: "A", exerciceBudgetaire: 2023 },
    { regionAttachementComptable: "A", programme: "A", exerciceBudgetaire: 2021 },
    { regionAttachementComptable: "B", exerciceBudgetaire: 2021 },
    { regionAttachementComptable: "A", exerciceBudgetaire: 2022 },
    { programme: "B", exerciceBudgetaire: 2021 },
    { programme: "A", exerciceBudgetaire: 2022 },
];

const B_LIST = [
    { regionAttachementComptable: "A", programme: "A", exerciceBudgetaire: 2021 },
    { regionAttachementComptable: "A", programme: "B", exerciceBudgetaire: 2024 },
    { regionAttachementComptable: "A", programme: "A", exerciceBudgetaire: 2020 },
    { regionAttachementComptable: "A", exerciceBudgetaire: 2022 },
    { regionAttachementComptable: "A", exerciceBudgetaire: 2021 },
    { programme: "A", exerciceBudgetaire: 2022 },
    { programme: "A", exerciceBudgetaire: 2021 },
];

const COLS_LIST = [
    [VARS.REGION_ATTACHEMENT_COMPTABLE, VARS.PROGRAMME],
    [VARS.REGION_ATTACHEMENT_COMPTABLE, VARS.PROGRAMME],
    [VARS.REGION_ATTACHEMENT_COMPTABLE, VARS.PROGRAMME],
    [VARS.REGION_ATTACHEMENT_COMPTABLE],
    [VARS.REGION_ATTACHEMENT_COMPTABLE],
    [VARS.PROGRAMME],
    [VARS.PROGRAMME],
];

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
        let mockFormatData;
        let mockSortData;
        beforeAll(() => {
            //@ts-expect-error : private method
            mockFormatData = vi.spyOn(controller, "_formatData").mockReturnValue([DTO[0], DTO[1]]);
            //@ts-expect-error : private method
            mockSortData = vi.spyOn(controller, "_sortData").mockReturnValue(1);
        });
        afterAll(() => {
            mockFormatData.mockRestore();
            mockSortData.mockRestore();
        });

        it("should call groupAndSum with the right parameters", () => {
            controller.getTableData(DTO as AmountsVsProgramRegionDto[], [VARS.PROGRAMME]);
            expect(dataVizHelper.groupAndSum).toHaveBeenCalledWith(DTO, [VARS.PROGRAMME]);
        });

        it("should call filterYears with the right parameters", () => {
            controller.getTableData(DTO as AmountsVsProgramRegionDto[], [VARS.PROGRAMME]);
            expect(dataVizHelper.filterYears).toHaveBeenCalledWith([DTO[0]], 2021);
        });

        it("should call formatData with the right parameter", () => {
            controller.getTableData(DTO as AmountsVsProgramRegionDto[], [VARS.PROGRAMME]);
            expect(mockFormatData).toHaveBeenCalledWith([DTO[0]]);
        });

        it("should call sortData with the right parameters", () => {
            controller.getTableData(DTO as AmountsVsProgramRegionDto[], [VARS.PROGRAMME]);
            expect(mockSortData).toHaveBeenCalledWith(DTO[1], DTO[0], [VARS.PROGRAMME]);
        });
    });

    describe("sortData", () => {
        it.each`
            a            | b            | selectedColumns
            ${A_LIST[0]} | ${B_LIST[0]} | ${COLS_LIST[0]}
            ${A_LIST[1]} | ${B_LIST[1]} | ${COLS_LIST[1]}
            ${A_LIST[2]} | ${B_LIST[2]} | ${COLS_LIST[2]}
            ${A_LIST[3]} | ${B_LIST[3]} | ${COLS_LIST[3]}
            ${A_LIST[4]} | ${B_LIST[4]} | ${COLS_LIST[4]}
            ${A_LIST[5]} | ${B_LIST[5]} | ${COLS_LIST[5]}
            ${A_LIST[6]} | ${B_LIST[6]} | ${COLS_LIST[6]}
        `("should sort data by region, programme and budget year", ({ a, b, selectedColumns }) => {
            const expected = 1;
            //@ts-expect-error : private method
            const actual = controller._sortData(a, b, selectedColumns);
            expect(actual).toEqual(expected);
        });
    });
});
