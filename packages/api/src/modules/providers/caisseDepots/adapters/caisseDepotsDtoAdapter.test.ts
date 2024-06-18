import { DemandeSubvention } from "dto";
import { CAISSE_DES_DEPOTS_RECORDS } from "../../../../../tests/dataProviders/api/caisseDepots.fixtures";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { RawApplication } from "../../../grant/@types/rawGrant";
import CaisseDepotsDtoAdapter from "./caisseDepotsDtoAdapter";
import caisseDepotsService from "../caisseDepots.service";

jest.mock("../caisseDepots.service", () => ({
    __esModule: true,
    default: { provider: { name: "Caisse des dépôts" } },
}));

describe("CaisseDepotsDtoAdapter", () => {
    describe("_multiannuality", () => {
        const DTO_MULITANNUAL_FIELDS = {
            datesversement_debut: new Date(2020, 9, 2),
            conditionsversement: "ECHELONNE",
            datesversement_fin: new Date(2021, 10, 4),
        };
        const CLOSE_END = new Date(2020, 10, 6);

        function test(expectMulti, changeToMultiDto) {
            const expected = expectMulti ? "Oui" : "Non";
            // @ts-expect-error mock private method
            const actual = CaisseDepotsDtoAdapter._multiannuality({
                fields: { ...DTO_MULITANNUAL_FIELDS, ...changeToMultiDto },
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

    describe("rawToApplication", () => {
        // @ts-expect-error: parameter type
        const RAW_APPLICATION: RawApplication<CaisseDepotsSubventionDto> = { data: { foo: "bar" } };
        // @ts-expect-error parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };

        let mockToDemandeSubvention: jest.SpyInstance;

        beforeAll(() => {
            mockToDemandeSubvention = jest.spyOn(CaisseDepotsDtoAdapter, "toDemandeSubvention");
            mockToDemandeSubvention.mockReturnValue(APPLICATION);
        });

        afterEach(() => {
            mockToDemandeSubvention.mockClear();
        });

        afterAll(() => {
            mockToDemandeSubvention.mockRestore();
        });

        it("should call toDemandeSubvention()", () => {
            CaisseDepotsDtoAdapter.rawToApplication(RAW_APPLICATION);
            expect(mockToDemandeSubvention).toHaveBeenCalledWith(RAW_APPLICATION.data);
        });

        it("should return DemandeSubvention", () => {
            const expected = APPLICATION;
            const actual = CaisseDepotsDtoAdapter.rawToApplication(RAW_APPLICATION);
            expect(actual).toEqual(expected);
        });
    });

    describe("toDemandeSubvention", () => {
        const INPUT = CAISSE_DES_DEPOTS_RECORDS[0];
        const DATE = new Date(INPUT.timestamp);
        const toPvSpy = jest
            .spyOn(ProviderValueFactory, "buildProviderValueAdapter")
            // @ts-expect-error mock
            .mockImplementation((name, date) => v => ({
                value: v,
                providerData: "tata",
            }));
        it("generate ProviderValueAdapter with proper date and name", () => {
            CaisseDepotsDtoAdapter.toDemandeSubvention(INPUT);
            expect(toPvSpy).toBeCalledWith(caisseDepotsService.provider.name, DATE);
        });

        it("returns proper value", () => {
            const actual = CaisseDepotsDtoAdapter.toDemandeSubvention(INPUT);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("toCommon", () => {
        it("returns proper result", () => {
            const INPUT = CAISSE_DES_DEPOTS_RECORDS[0];
            const actual = CaisseDepotsDtoAdapter.toCommon(INPUT);
            expect(actual).toMatchSnapshot();
        });
    });
});
