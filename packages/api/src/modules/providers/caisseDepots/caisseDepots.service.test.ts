import caisseDepotsService from "./caisseDepots.service";
import CaisseDepotsDtoAdapter from "./adapters/caisseDepotsDtoAdapter";
import providerRequestService from "../../provider-request/providerRequest.service";

jest.mock("./adapters/caisseDepotsDtoAdapter");

describe("CaisseDepotsService", () => {
    const TOKEN = "TOKEN";
    const IDENTIFIER = "toto";
    let privateRawGetSpy, privateGetSpy;

    beforeAll(() => {
        // @ts-expect-error: mock
        privateRawGetSpy = jest.spyOn(caisseDepotsService, "getRawCaisseDepotsSubventions");
        // @ts-expect-error: mock
        privateGetSpy = jest.spyOn(caisseDepotsService, "getCaisseDepotsSubventions");
    });

    describe("getRawCaisseDepotsSubventions", () => {
        const GET_RESPONSE = { data: { records: [{ record: 1 }, { record: 2 }] } };
        let httpGetSpy: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error http is protected method
            httpGetSpy = jest.spyOn(caisseDepotsService.http, "get");
            httpGetSpy.mockResolvedValue(GET_RESPONSE);
        });

        it("calls axios get with proper url", async () => {
            const URL =
                'https://opendata.caissedesdepots.fr/api/v2/catalog/datasets/subventions-attribuees-par-la-caisse-des-depots-depuis-01012018/records?where=search(idbeneficiaire, "toto")';
            // @ts-expect-error: mock
            await caisseDepotsService.getRawCaisseDepotsSubventions(IDENTIFIER);
            expect(httpGetSpy).toBeCalledWith(URL);
        });

        it("returns records from axios get", async () => {
            const expected = [1, 2];
            // @ts-expect-error: mock
            const actual = await caisseDepotsService.getRawCaisseDepotsSubventions(IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("return empty array if no records", async () => {
            httpGetSpy.mockResolvedValueOnce({ data: null });
            const expected = [];
            // @ts-expect-error: mock
            const actual = await caisseDepotsService.getRawCaisseDepotsSubventions(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("getCaisseDepotsSubventions", () => {
        const IDENTIFIER = "toto";
        const RAW_RES = [1, 2];

        beforeAll(() => {
            privateRawGetSpy.mockResolvedValue(RAW_RES);
            CaisseDepotsDtoAdapter.toDemandeSubvention
                // @ts-expect-error: mock
                .mockImplementation(input => input.toString());
        });

        afterAll(() => {
            privateRawGetSpy.mockReset();
            // @ts-expect-error: mock
            CaisseDepotsDtoAdapter.toDemandeSubvention.mockReset();
        });

        it("calls raw get method", async () => {
            // @ts-expect-error test private method
            await caisseDepotsService.getCaisseDepotsSubventions(IDENTIFIER);
            expect(privateRawGetSpy).toBeCalledWith(IDENTIFIER);
        });

        it("calls adapter with records from raw get", async () => {
            // @ts-expect-error: mock
            await caisseDepotsService.getCaisseDepotsSubventions(IDENTIFIER);
            expect(CaisseDepotsDtoAdapter.toDemandeSubvention).toBeCalledWith(1);
            expect(CaisseDepotsDtoAdapter.toDemandeSubvention).toBeCalledWith(2); //check two expect ok
        });

        it("return result from adapter", async () => {
            const expected = ["1", "2"];
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
        ${"Siren"}     | ${"120001011"}      | ${"120001011*"}
        ${"Siret"}     | ${"12000101100010"} | ${"12000101100010"}
    `("getDemandeSubventionBy$identifierType", ({ identifierCalled, identifierGiven, identifierType }) => {
        const RES = {};

        beforeAll(() => {
            privateGetSpy.mockResolvedValue(RES);
        });
        afterAll(() => privateGetSpy.mockReset());

        it(`calls get subventions with ${identifierType} ${identifierGiven}`, async () => {
            await caisseDepotsService[`getDemandeSubventionBy${identifierType}`](identifierCalled);
            expect(privateGetSpy).toBeCalledWith(identifierGiven);
        });

        it("returns result from get", async () => {
            const expected = RES;
            const actual = await caisseDepotsService[`getDemandeSubventionBy${identifierType}`](identifierCalled);
            expect(actual).toEqual(expected);
        });
    });

    describe.each`
        identifierType | identifierCalled    | identifierGiven
        ${"Siret"}     | ${"12000101100010"} | ${"12000101100010"}
        ${"Siren"}     | ${"120001011"}      | ${"120001011*"}
    `("getRawGrantsBy$identifierType", ({ identifierCalled, identifierGiven, identifierType }) => {
        const RES = [1, 2];

        beforeAll(() => {
            privateRawGetSpy.mockResolvedValue(RES);
        });
        afterAll(() => {
            privateRawGetSpy.mockReset();
        });

        it(`calls get subventions with ${identifierType} ${identifierGiven}`, async () => {
            await caisseDepotsService[`getRawGrantsBy${identifierType}`](identifierCalled);
            expect(privateRawGetSpy).toBeCalledWith(identifierGiven);
        });

        it("returns described result from get", async () => {
            const RES = [1, 2];
            const expected = [
                {
                    provider: "caisseDepots",
                    type: "fullGrant",
                    data: 1,
                },
                {
                    provider: "caisseDepots",
                    type: "fullGrant",
                    data: 2,
                },
            ];
            privateRawGetSpy.mockResolvedValueOnce(RES);
            const actual = await caisseDepotsService[`getRawGrantsBy${identifierType}`](identifierCalled);
            expect(actual).toMatchObject(expected);
        });
    });

    describe("rawToCommon", () => {
        const RAW = "RAW";
        const ADAPTED = {};

        beforeAll(() => {
            CaisseDepotsDtoAdapter.toCommon
                // @ts-expect-error: mock
                .mockImplementation(input => input.toString());
        });

        afterAll(() => {
            // @ts-expect-error: mock
            CaisseDepotsDtoAdapter.toCommon.mockReset();
        });

        it("calls adapter with data from raw grant", () => {
            // @ts-expect-error: mock
            caisseDepotsService.rawToCommon({ data: RAW });
            expect(CaisseDepotsDtoAdapter.toCommon).toHaveBeenCalledWith(RAW);
        });
        it("returns result from adapter", () => {
            // @ts-expect-error: mock
            CaisseDepotsDtoAdapter.toCommon.mockReturnValueOnce(ADAPTED);
            const expected = ADAPTED;
            // @ts-expect-error: mock
            const actual = caisseDepotsService.rawToCommon({ data: RAW });
            expect(actual).toEqual(expected);
        });
    });
});
