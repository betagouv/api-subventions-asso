import grantService from "./grant.service";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import { isSiret } from "../../shared/Validators";
import commonGrantService from "./commonGrant.service";
import mocked = jest.mocked;
import { siretToSiren } from "../../shared/helpers/SirenHelper";
import associationsService from "../associations/associations.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import RnaSirenEntity from "../../entities/RnaSirenEntity";

jest.mock("../providers", () => ({
    prov1: { isGrantProvider: true, name: "prov1" },
    prov2: { name: "prov3" },
    prov3: { isGrantProvider: false, name: "prov2" },
}));

jest.mock("../../shared/Validators");
jest.mock("../../shared/helpers/IdentifierHelper");
jest.mock("./commonGrant.service");
jest.mock("../associations/associations.service");
jest.mock("../../shared/helpers/SirenHelper");

describe("GrantService", () => {
    const JOINED = "JOINED";

    describe("getRawGrants", () => {
        const SIREN = "123456789";
        const RNA = "W1234567";
        let getSirenMock, joinGrantsMock;
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
            mocked(getIdentifierType).mockReturnValue(StructureIdentifiersEnum.siren);
            getSirenMock = jest.spyOn(rnaSirenService, "find").mockResolvedValue([new RnaSirenEntity(RNA, SIREN)]);
            joinGrantsMock = jest.spyOn(grantService as any, "joinGrants").mockReturnValue(JOINED);
            mocked(associationsService.isSirenFromAsso).mockResolvedValue(true);

            mockedProviders = [generateProvider("prov1"), generateProvider("prov2")];
            getProvidersMock = jest.spyOn(grantService as any, "getGrantProviders").mockReturnValue(mockedProviders);
        });

        afterAll(() => {
            mocked(getIdentifierType).mockRestore();
            getSirenMock.mockRestore();
            joinGrantsMock.mockRestore();
            getProvidersMock.mockRestore();
        });

        it("get providers", async () => {
            await grantService.getRawGrants(SIREN);
            expect(getProvidersMock).toHaveBeenCalled();
        });

        it("identifies identifier type", async () => {
            await grantService.getRawGrants(SIREN);
            expect(getIdentifierType).toHaveBeenCalled();
        });

        it("throws if incorrect identifier", async () => {
            mocked(getIdentifierType).mockReturnValueOnce(null);
            const test = () => grantService.getRawGrants(SIREN);
            await expect(test).rejects.toThrow();
        });

        it("if rna, get siren", async () => {
            mocked(getIdentifierType).mockReturnValueOnce(StructureIdentifiersEnum.rna);
            await grantService.getRawGrants(RNA);
            expect(getSirenMock).toHaveBeenCalledWith(RNA);
        });

        it("does not check if rna given", async () => {
            mocked(getIdentifierType).mockReturnValueOnce(StructureIdentifiersEnum.rna);
            await grantService.getRawGrants(ID);
            expect(associationsService.isSirenFromAsso).not.toHaveBeenCalled();
        });

        it("checks if siren is from asso", async () => {
            mocked(getIdentifierType).mockReturnValueOnce(StructureIdentifiersEnum.siren);
            mocked(siretToSiren).mockReturnValueOnce(SIREN);
            await grantService.getRawGrants(ID);
            expect(associationsService.isSirenFromAsso).toHaveBeenCalledWith(SIREN);
        });

        it("checks if siret is from asso", async () => {
            mocked(getIdentifierType).mockReturnValueOnce(StructureIdentifiersEnum.siret);
            mocked(siretToSiren).mockReturnValueOnce(SIREN);
            await grantService.getRawGrants(ID);
            expect(associationsService.isSirenFromAsso).toHaveBeenCalledWith(SIREN);
        });

        it.each`
            identifierType                    | methodName               | notFoundSirenFromRna | aboutFindingRna       | id
            ${StructureIdentifiersEnum.siret} | ${"getRawGrantsBySiret"} | ${false}             | ${""}                 | ${ID}
            ${StructureIdentifiersEnum.siren} | ${"getRawGrantsBySiren"} | ${false}             | ${""}                 | ${ID}
            ${StructureIdentifiersEnum.rna}   | ${"getRawGrantsBySiren"} | ${false}             | ${" (siren found)"}   | ${SIREN}
            ${StructureIdentifiersEnum.rna}   | ${"getRawGrantsByRna"}   | ${true}              | ${"(siren not found"} | ${ID}
        `(
            "calls appropriate method of provider by $identifierType$aboutFindingRna",
            async ({ identifierType, methodName, notFoundSirenFromRna, id }) => {
                mocked(getIdentifierType).mockReturnValueOnce(identifierType);
                if (notFoundSirenFromRna) getSirenMock.mockResolvedValueOnce(null);
                await grantService.getRawGrants(ID);
                mockedProviders.map(provider => expect(provider[methodName]).toHaveBeenCalledWith(id));
            },
        );

        it("join grants with flattened results from providers", async () => {
            mockedProviders[0].getRawGrantsBySiren.mockResolvedValueOnce([1, 2]);
            mockedProviders[1].getRawGrantsBySiren.mockResolvedValueOnce([3]);
            const expected = [1, 2, 3];
            await grantService.getRawGrants(ID);
            expect(joinGrantsMock).toHaveBeenCalledWith(expected);
        });

        it("replaces falsy values with empty array", async () => {
            mockedProviders[0].getRawGrantsBySiren.mockResolvedValueOnce(false);
            mockedProviders[1].getRawGrantsBySiren.mockResolvedValueOnce([3]);
            const expected = [3];
            await grantService.getRawGrants(ID);
            expect(joinGrantsMock).toHaveBeenCalledWith(expected);
        });

        it("return joined grants", async () => {
            const expected = JOINED;
            const actual = await grantService.getRawGrants(SIREN);
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
            getGrantMock = jest.spyOn(grantService as any, "getRawGrants").mockResolvedValue(JOINED);
            mocked(isSiret).mockReturnValue(siret);
            mocked(getIdentifierType).mockReturnValue(
                siret ? StructureIdentifiersEnum.siret : StructureIdentifiersEnum.rna,
            );
        });

        afterAll(() => {
            getGrantMock.mockRestore();
            mocked(getIdentifierType).mockRestore();
        });

        it("tests if id is siret", async () => {
            await grantService[testedMethod](SIRET);
            expect(isSiret).toHaveBeenCalledWith(SIRET);
        });

        it("throws if id is$not siret", async () => {
            mocked(isSiret).mockReturnValueOnce(!siret);
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
            const actual = (grantService as any).joinGrants(given);
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
            getGrantsMock = jest.spyOn(grantService, "getRawGrants").mockResolvedValue([1, 2]);
            // @ts-expect-error: mock
            mocked(commonGrantService.rawToCommon).mockImplementation(v => v);
        });

        afterAll(() => {
            getGrantsMock.mockReset();
            mocked(commonGrantService.rawToCommon).mockReset();
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
            mocked(commonGrantService.rawToCommon).mockReturnValueOnce(null);
            const expected = [2];
            const actual = await grantService.getCommonGrants(ID, true);
            expect(actual).toEqual(expected);
        });
    });
});
