import caisseDepotsEntity from "../../../../../tests/modules/providers/caisseDepots/entity";
import caisseDepotsService, { CaisseDepotsService } from "../caisseDepots.service";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import CaisseDepotsDtoAdapter from "./caisseDepotsDtoAdapter";

jest.mock("../caisseDepots.service", () => ({
    __esModule: true,
    default: { provider: { name: "TOTO" } }
}));

describe("CaisseDepotsDtoAdapter", () => {
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
