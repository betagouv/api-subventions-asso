import grantService from "./grant.service";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import rnaSirenService from "../_open-data/rna-siren/rnaSiren.service";
import { isSiret } from "../../shared/Validators";
import commonGrantService from "./commonGrant.service";

jest.mock("../providers", () => ({
    prov1: { isGrantProvider: true, name: "prov1" },
    prov2: { name: "prov3" },
    prov3: { isGrantProvider: false, name: "prov2" },
}));

jest.mock("../../shared/Validators");

jest.mock("../../shared/helpers/IdentifierHelper");
jest.mock("./commonGrant.service");

describe("GrantService", () => {
    const RAW = "RAW";
    const JOINED = "JOINED";

    describe("getGrants", () => {
        const SIREN = "123456789";
        const RNA = "W1234567";
        let getSirenMock, getRawGrantMock, joinGrantsMock;

        beforeAll(() => {
            // @ts-expect-error - mock
            getIdentifierType.mockReturnValue(StructureIdentifiersEnum.siren);
            getSirenMock = jest.spyOn(rnaSirenService, "getSiren").mockResolvedValue(SIREN);
            // @ts-expect-error - mock
            getRawGrantMock = jest.spyOn(grantService, "getRawGrantsByMethod").mockResolvedValue(RAW);
            // @ts-expect-error - mock
            joinGrantsMock = jest.spyOn(grantService, "joinGrants").mockReturnValue(JOINED);
        });

        afterAll(() => {
            // @ts-expect-error - mock
            getIdentifierType.mockRestore();
            getSirenMock.mockRestore();
            getRawGrantMock.mockRestore();
            joinGrantsMock.mockRestore();
        });

        it("identifies identifier type", async () => {
            await grantService.getGrantsByAssociation(SIREN);
            expect(getIdentifierType).toHaveBeenCalled();
        });
        it("throws if incorrect identifier", async () => {
            // @ts-expect-error - mock
            getIdentifierType.mockReturnValueOnce(null);
            const test = () => grantService.getGrantsByAssociation(SIREN);
            await expect(test).rejects.toThrow();
        });
        it("if rna, get siren", async () => {
            // @ts-expect-error - mock
            getIdentifierType.mockReturnValueOnce(StructureIdentifiersEnum.rna);
            await grantService.getGrantsByAssociation(RNA);
            expect(getSirenMock).toHaveBeenCalledWith(RNA);
        });
        it("if rna, get raw grants by given siren", async () => {
            // @ts-expect-error - mock
            getIdentifierType.mockReturnValueOnce(StructureIdentifiersEnum.rna);
            await grantService.getGrantsByAssociation(RNA);
            expect(getRawGrantMock).toHaveBeenCalledWith(SIREN, "SIREN");
        });
        it("get raw grants by given identifier", async () => {
            await grantService.getGrantsByAssociation(SIREN);
            expect(getRawGrantMock).toHaveBeenCalledWith(SIREN, "SIREN");
        });
        it("join gotten grants", async () => {
            await grantService.getGrantsByAssociation(RNA);
            expect(joinGrantsMock).toHaveBeenCalledWith(RAW);
        });
        it("return joined grants", async () => {
            const expected = JOINED;
            const actual = await grantService.getGrantsByAssociation(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe.each`
        testedMethod                  | siret    | not
        ${"getGrantsByAssociation"}   | ${false} | ${""}
        ${"getGrantsByEstablishment"} | ${true}  | ${" not"}
    `("$testedMethod", ({ testedMethod, siret }) => {
        let getGrantMock;
        const SIRET = "12345678901234";

        beforeAll(() => {
            // @ts-expect-error - mock
            getGrantMock = jest.spyOn(grantService, "getGrants").mockResolvedValue(JOINED);
            // @ts-expect-error - mock
            isSiret.mockReturnValue(siret);
            // @ts-expect-error - mock
            getIdentifierType.mockReturnValue(siret ? StructureIdentifiersEnum.siret : StructureIdentifiersEnum.rna);
        });

        afterAll(() => {
            getGrantMock.mockRestore();
            // @ts-expect-error - mock
            getIdentifierType.mockRestore();
        });

        it("tests if id is siret", async () => {
            await grantService[testedMethod](SIRET);
            expect(isSiret).toHaveBeenCalledWith(SIRET);
        });

        it("throws if id is$not siret", async () => {
            // @ts-expect-error - mock
            isSiret.mockReturnValueOnce(!siret);
            const test = () => grantService[testedMethod](SIRET);
            await expect(test).rejects.toThrow();
        });

        it("get grants by given identifier", async () => {
            await grantService[testedMethod](SIRET);
            expect(getGrantMock).toHaveBeenCalledWith(SIRET);
        });

        it("return grants", async () => {
            const expected = JOINED;
            const actual = await grantService[testedMethod](SIRET);
            expect(actual).toEqual(expected);
        });
    });

    describe("getRawGrantsByMethod", () => {
        let getProvidersMock;
        let mockedProviders: any;
        const ID = "ID";

        function generateProvider(name) {
            return {
                getRawGrantsByRna: jest.fn().mockResolvedValue(null),
                getRawGrantsBySiren: jest.fn().mockResolvedValue(null),
                getRawGrantsBySiret: jest.fn().mockResolvedValue(null),
                provider: { name },
            };
        }

        beforeAll(() => {
            mockedProviders = [generateProvider("prov1"), generateProvider("prov2")];
            getProvidersMock = jest
                // @ts-expect-error - mock
                .spyOn(grantService, "getGrantProviders")
                // @ts-expect-error - mock
                .mockReturnValue(mockedProviders);
        });

        afterAll(() => {
            getProvidersMock.mockRestore();
        });
        it("get providers", () => {});

        it.each`
            identifierType                    | methodName
            ${StructureIdentifiersEnum.siret} | ${"getRawGrantsBySiret"}
            ${StructureIdentifiersEnum.siren} | ${"getRawGrantsBySiren"}
            ${StructureIdentifiersEnum.rna}   | ${"getRawGrantsByRna"}
        `("calls appropriate method of provider by $identifierType", async ({ identifierType, methodName }) => {
            // @ts-expect-error - mock
            await grantService.getRawGrantsByMethod(ID, identifierType);
            mockedProviders.map(provider => expect(provider[methodName]).toHaveBeenCalledWith(ID));
        });

        it("returns flattened results from providers", async () => {
            mockedProviders[0].getRawGrantsBySiren.mockResolvedValueOnce([1, 2]);
            mockedProviders[1].getRawGrantsBySiren.mockResolvedValueOnce([3]);
            const expected = [1, 2, 3];
            // @ts-expect-error - mock
            const actual = await grantService.getRawGrantsByMethod(ID, StructureIdentifiersEnum.siren);
            expect(actual).toEqual(expected);
        });
        it("replaces falsy values with empty array", async () => {
            mockedProviders[0].getRawGrantsBySiren.mockResolvedValueOnce(false);
            mockedProviders[1].getRawGrantsBySiren.mockResolvedValueOnce([3]);
            const expected = [3];
            // @ts-expect-error - mock
            const actual = await grantService.getRawGrantsByMethod(ID, StructureIdentifiersEnum.siren);
            expect(actual).toEqual(expected);
        });
    });

    describe("getGrantProviders", () => {
        it("returns filtered grant providers", () => {
            // @ts-ignore
            const actual = grantService.getGrantProviders();
            const expected = [{ isGrantProvider: true, name: "prov1" }];
            expect(actual).toEqual(expected);
        });
    });

    describe("joinGrants", () => {
        function tryAndTest(given) {
            // @ts-expect-error: test private method
            const actual = grantService.joinGrants(given);
            expect(actual).toMatchSnapshot();
        }

        it("joins grants with same joinKey", () => {
            const given = [
                { joinKey: "1", data: "a", type: "payment" },
                {
                    joinKey: "1",
                    data: "b",
                    type: "payment",
                },
                { joinKey: "1", data: "c", type: "application" },
                { joinKey: "2", data: "d", type: "payment" },
            ];
            tryAndTest(given);
        });
        it("returns joined and lonely grants", () => {
            const given = [
                { joinKey: "1", data: "a", type: "payment" },
                {
                    data: "b",
                    type: "payment",
                },
            ];
            tryAndTest(given);
        });
    });

    describe("getCommonGrants", () => {
        let getGrantsMock;
        const ID = "ID";
        beforeAll(() => {
            // @ts-expect-error: mock
            getGrantsMock = jest.spyOn(grantService, "getGrants").mockResolvedValue([1, 2]);
            // @ts-expect-error: mock
            commonGrantService.rawToCommon.mockImplementation(v => v);
        });
        afterAll(() => {
            getGrantsMock.mockReset();
            // @ts-expect-error: mock
            commonGrantService.rawToCommon.mockReset();
        });
        it("gets raw grants", async () => {
            await grantService.getCommonGrants(ID);
            expect(getGrantsMock).toHaveBeenCalledWith(ID);
        });
        it("calls adapter as many times as necessary", async () => {
            await grantService.getCommonGrants(ID);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledWith(1, false);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledTimes(2);
        });

        it("calls adapter as many times as necessary with publishable param", async () => {
            await grantService.getCommonGrants(ID, true);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledWith(1, true);
            expect(commonGrantService.rawToCommon).toHaveBeenCalledTimes(2);
        });
        it("returns adapted and filtered grants", async () => {
            // @ts-expect-error: mock
            commonGrantService.rawToCommon.mockReturnValueOnce(null);
            const expected = [2];
            const actual = await grantService.getCommonGrants(ID, true);
            expect(actual).toEqual(expected);
        });
    });
});
