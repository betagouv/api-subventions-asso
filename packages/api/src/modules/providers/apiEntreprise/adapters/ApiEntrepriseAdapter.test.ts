import { frenchToEnglishMonthsMap } from "../../../../shared/helpers/DateHelper";
import ApiEntrepriseAdapter from "./ApiEntrepriseAdapter";

describe("ApiEntrepriseAdapter", () => {
    describe("toValidDate", () => {
        Object.keys(frenchToEnglishMonthsMap).map(month => {
            it(`return valid date for ${month}`, () => {
                const expected = new Date(`20 ${frenchToEnglishMonthsMap[month]} 2022`);
                const actual = ApiEntrepriseAdapter.toValidDate(`20 ${month} 2022`);
                expect(actual).toEqual(expected);
            });
        });
    })
})