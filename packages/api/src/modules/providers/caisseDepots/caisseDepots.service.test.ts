import caisseDepotsService from "./caisseDepots.service";
import axios from "axios";
import CaisseDepotsDtoAdapter from "./adapters/caisseDepotsDtoAdapter";

describe("CaisseDepotsService", () => {
    const TOKEN = "TOKEN";
    // @ts-expect-error: mock
    const privateGetSpy = jest.spyOn(caisseDepotsService, "getCaisseDepotsSubventions");

    describe("getCaisseDepotsSubventions", () => {
        const IDENTIFIER = "toto";
        const AXIOS_RES = { data: { records: [{ record: 1 }, { record: 2 }] } };
        const axiosGetSpy = jest.spyOn(axios, "get").mockResolvedValue(AXIOS_RES);
        const adapterSpy = jest
            .spyOn(CaisseDepotsDtoAdapter, "toDemandeSubvention")
            // @ts-expect-error: mock
            .mockImplementation(input => input.toString());

        it("calls axios get with proper url", async () => {
            const URL =
                'https://opendata.caissedesdepots.fr/api/v2/catalog/datasets/subventions-attribuees-par-la-caisse-des-depots-depuis-01012018/records?where=search(idbeneficiare,"toto")';
            // @ts-expect-error: mock
            await caisseDepotsService.getCaisseDepotsSubventions(IDENTIFIER);
            expect(axiosGetSpy).toBeCalledWith(URL);
        });

        it("calls adapter with records from axios get", async () => {
            // @ts-expect-error: mock
            await caisseDepotsService.getCaisseDepotsSubventions(IDENTIFIER);
            expect(adapterSpy).toBeCalledWith(1);
            expect(adapterSpy).toBeCalledWith(2); //check two expect ok
        });

        it("return result from adapter", async () => {
            const expected = ["1", "2"];
            // @ts-expect-error: mock
            const actual = await caisseDepotsService.getCaisseDepotsSubventions(IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("return [] if axios fails", async () => {
            axiosGetSpy.mockRejectedValueOnce({});
            const expected = [];
            // @ts-expect-error: mock
            const actual = await caisseDepotsService.getCaisseDepotsSubventions(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionByRna", () => {
        it("returns null", async () => {
            const actual = await caisseDepotsService.getDemandeSubventionByRna("");
            expect(actual).toBeNull();
        });
    });

    describe.each`
        identifierType | identifierCalled    | identifierGiven
        ${"Siret"}     | ${"12000101100010"} | ${"12000101100010"}
        ${"Siren"}     | ${"120001011"}      | ${"120001011*"}
    `("getDemandeSubventionBy$identifierType", ({ identifierCalled, identifierGiven, identifierType }) => {
        it(`calls get subventions with ${identifierType} ${identifierGiven}`, async () => {
            await caisseDepotsService[`getDemandeSubventionBy${identifierType}`](identifierCalled);
            expect(privateGetSpy).toBeCalledWith(identifierGiven);
        });

        it("returns result from get", async () => {
            const RES = {};
            const expected = RES;
            // @ts-expect-error mock
            privateGetSpy.mockResolvedValueOnce(RES);
            const actual = await caisseDepotsService[`getDemandeSubventionBy${identifierType}`](identifierCalled);
            expect(actual).toEqual(expected);
        });
    });
});
