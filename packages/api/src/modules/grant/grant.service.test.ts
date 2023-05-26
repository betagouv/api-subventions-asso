import grantService from "./grant.service";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import rnaSirenService from "../open-data/rna-siren/rnaSiren.service";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";

jest.mock("../providers", () => ({
    prov1: { isGrantProvider: true, name: "prov1" },
    prov2: { name: "prov3" },
    prov3: { isGrantProvider: false, name: "prov2" },
}));

describe("GrantService", () => {
    const RAW = "RAW";
    const JOINED = "JOINED";

    describe("getGrantsByAssociation", () => {
        const SIREN = "123456789";
        const RNA = "W1234567";
        let identifierTypeMock, getSirenMock, getRawGrantMock, joinGrantsMock;

        beforeAll(() => {
            identifierTypeMock = jest
                .spyOn(IdentifierHelper, "getIdentifierType")
                .mockReturnValue(StructureIdentifiersEnum.siren);
            getSirenMock = jest.spyOn(rnaSirenService, "getSiren").mockResolvedValue(SIREN);
            // @ts-expect-error - mock
            getRawGrantMock = jest.spyOn(grantService, "getRawGrantsByMethod").mockResolvedValue(RAW);
            // @ts-expect-error - mock
            joinGrantsMock = jest.spyOn(grantService, "joinGrants").mockReturnValue(JOINED);
        });

        afterAll(() => {
            identifierTypeMock.mockRestore();
            getSirenMock.mockRestore();
            getRawGrantMock.mockRestore();
            joinGrantsMock.mockRestore();
        });

        it("identifies identifier type", async () => {
            await grantService.getGrantsByAssociation(SIREN);
            expect(identifierTypeMock).toHaveBeenCalled();
        });
        it("throws if incorrect identifier", async () => {
            identifierTypeMock.mockReturnValueOnce(null);
            const test = () => grantService.getGrantsByAssociation(SIREN);
            await expect(test).rejects.toThrowError(new AssociationIdentifierError());
        });
        it("if rna, get siren", async () => {
            identifierTypeMock.mockReturnValueOnce(StructureIdentifiersEnum.rna);
            await grantService.getGrantsByAssociation(RNA);
            expect(getSirenMock).toHaveBeenCalledWith(RNA);
        });
        it("if rna, get raw grants by given siren", async () => {
            identifierTypeMock.mockReturnValueOnce(StructureIdentifiersEnum.rna);
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

    describe("getGrantsByEstablishment", () => {
        let getRawGrantMock, joinGrantsMock;
        const SIRET = "12345678901234";

        beforeAll(() => {
            // @ts-expect-error - mock
            getRawGrantMock = jest.spyOn(grantService, "getRawGrantsByMethod").mockResolvedValue(RAW);
            // @ts-expect-error - mock
            joinGrantsMock = jest.spyOn(grantService, "joinGrants").mockReturnValue(JOINED);
        });

        afterAll(() => {
            getRawGrantMock.mockRestore();
            joinGrantsMock.mockRestore();
        });

        it("get raw grants by given identifier", async () => {
            await grantService.getGrantsByEstablishment(SIRET);
            expect(getRawGrantMock).toHaveBeenCalledWith(SIRET, "SIRET");
        });
        it("join gotten grants", async () => {
            await grantService.getGrantsByEstablishment(SIRET);
            expect(joinGrantsMock).toHaveBeenCalledWith(RAW);
        });
        it("return joined grants", async () => {
            const expected = JOINED;
            const actual = await grantService.getGrantsByEstablishment(SIRET);
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
});
