import caisseDepotsEntity from "../../../../../tests/modules/providers/caisseDepots/entity";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import CaisseDepotsDtoAdapter from "./caisseDepotsDtoAdapter";

jest.mock("../caisseDepots.service", () => ({
    __esModule: true,
    default: { provider: { name: "TOTO" } }
}));

describe("CaisseDepotsDtoAdapter", () => {
    describe("_multiannuality", () => {
        const DTO_MULITANNUAL_FIELDS = {
            datesversement_debut: new Date(2020, 9, 2),
            conditionsversement: "ECHELONNE",
            datesversement_fin: new Date(2021, 10, 4)
        };
        const CLOSE_END = new Date(2020, 10, 6);

        function test(expectMulti, changeToMultiDto) {
            const expected = expectMulti ? "Oui" : "Non";
            // @ts-expect-error mock private method
            const actual = CaisseDepotsDtoAdapter._multiannuality({
                fields: { ...DTO_MULITANNUAL_FIELDS, ...changeToMultiDto }
            });
            return expect(actual).toBe(expected);
        }

        it("returns 'Non' if unique payment", () => {
            test(false, { conditionsversement: "UNIQUE" });
        });

        it.each`
            date
            ${"datesversement_debut"}
            ${"datesversement_fin"}
        `("returns 'Non' if missing '$1'", ({ date }) => {
            test(false, { [date]: null });
        });

        it("returns 'Non' if dates closer than one year", () => {
            test(false, { datesversement_fin: CLOSE_END });
        });

        it("returns 'Oui' if dates further than one year", () => {
            test(true, {});
        });
    });

    describe("toDemandeSubvention", () => {
        const INPUT = caisseDepotsEntity;
        const DATE = new Date(INPUT.timestamp);
        const toPvSpy = jest
            .spyOn(ProviderValueFactory, "buildProviderValueAdapter")
            // @ts-expect-error mock
            .mockImplementation((name, date) => v => ({
                value: v,
                providerData: "tata"
            }));
        it("generate ProviderValueAdapter with proper date and name", () => {
            CaisseDepotsDtoAdapter.toDemandeSubvention(INPUT);
            expect(toPvSpy).toBeCalledWith("TOTO", DATE);
        });

        it("returns proper value", () => {
            const actual = CaisseDepotsDtoAdapter.toDemandeSubvention(INPUT);
            expect(actual).toMatchSnapshot();
        });
    });
});
