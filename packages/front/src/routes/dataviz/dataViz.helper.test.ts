import { DTO, VARS } from "./__fixtures__/AmountsVsProgramRegion.fixture";
import { filterYears, groupAndSum } from "./dataViz.helper";

describe("groupAndSum", () => {
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
        const actual = groupAndSum(DTO, [VARS.PROGRAMME]);
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
        const actual = groupAndSum(DTO, ["regionAttachementComptable"]);
        expect(actual).toEqual(expected);
    });

    it("should return DTO if colSelected = ['regionAttachementComptable', 'programme']", () => {
        const amountsVsProgramRegionData = [
            { ...DTO[0], mission: "mission 1" },
            { ...DTO[1], mission: "mission 2" },
        ];

        const expected = [DTO[0], DTO[1]];
        const actual = groupAndSum(amountsVsProgramRegionData, [VARS.PROGRAMME, VARS.REGION_ATTACHEMENT_COMPTABLE]);
        expect(actual).toEqual(expected);
    });
});

describe("filterYears", () => {
    it("should return only data with exerciceBudgetaire >= yearMin and lower than current year", () => {
        const groupedData = [
            { ...DTO[0], exerciceBudgetaire: new Date().getFullYear() },
            { ...DTO[0], exerciceBudgetaire: new Date().getFullYear() + 1 },
            { ...DTO[2], exerciceBudgetaire: 2021 },
            { ...DTO[2], exerciceBudgetaire: 2023 },
            { ...DTO[1], exerciceBudgetaire: 2020 },
        ];

        const expected = [groupedData[1], groupedData[2]];
        const actual = filterYears(groupedData, 2021);
        expect(actual).toEqual(expected);
    });
});
