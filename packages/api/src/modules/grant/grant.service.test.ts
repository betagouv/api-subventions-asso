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
import { AnyRawGrant, JoinedRawGrant, RawApplication, RawFullGrant, RawGrant, RawPayment } from "./@types/rawGrant";
import * as Sentry from "@sentry/node";
import GrantProvider from "./@types/GrantProvider";
import { ProviderEnum } from "../../@enums/ProviderEnum";
jest.mock("@sentry/node");

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
    const mockGrantProvider = provider => ({
        provider,
        isGrantProvider: true,
        getRawGrantsBySiret: jest.fn(),
        getRawGrantsBySiren: jest.fn(),
    });

    const PROVIDERS: GrantProvider[] = [
        mockGrantProvider({ name: "PROVIDER_1", id: "ID_1", description: "", type: ProviderEnum.api }),
        mockGrantProvider({ name: "PROVIDER_2", id: "ID_2", description: "", type: ProviderEnum.api }),
        mockGrantProvider({ name: "PROVIDER_3", id: "ID_3", description: "", type: ProviderEnum.raw }),
    ];

    const JOINED = "JOINED";

    const JOIN_KEY_1 = "JOIN_KEY_1";
    const JOIN_KEY_2 = "JOIN_KEY_2";
    const FULL_GRANT: RawFullGrant = {
        provider: PROVIDERS[0].provider.id,
        data: { application: {}, payments: [] },
        type: "fullGrant",
        joinKey: JOIN_KEY_1,
    };
    const APPLICATION: RawApplication = {
        provider: PROVIDERS[1].provider.id,
        data: {},
        type: "application",
        joinKey: JOIN_KEY_2,
    };
    const PAYMENTS: RawPayment[] = [
        { provider: PROVIDERS[2].provider.id, data: {}, type: "payment", joinKey: JOIN_KEY_1 },
        { provider: PROVIDERS[2].provider.id, data: {}, type: "payment", joinKey: JOIN_KEY_1 },
        { provider: PROVIDERS[2].provider.id, data: {}, type: "payment", joinKey: JOIN_KEY_2 },
        { provider: PROVIDERS[2].provider.id, data: {}, type: "payment", joinKey: JOIN_KEY_2 },
    ];
    const RAW_GRANTS: AnyRawGrant[] = [FULL_GRANT, APPLICATION, ...PAYMENTS];
    const GRANTS_BY_TYPE = {
        fullGrants: [FULL_GRANT],
        applications: [APPLICATION],
        payments: PAYMENTS,
    };
    describe("reduceToProvidersById", () => {
        it("should return providers by id", () => {
            const expected = {
                [PROVIDERS[0].provider.id]: PROVIDERS[0],
                [PROVIDERS[1].provider.id]: PROVIDERS[1],
                [PROVIDERS[2].provider.id]: PROVIDERS[2],
            };
            const actual = PROVIDERS.reduce(grantService.reduceToProvidersById, {});
            expect(actual).toEqual(expected);
        });
    });

    describe("adapteRawGrant", () => {
        //@ts-expect-error: access private property
        const fullGrantProviders = grantService.fullGrantProviders;
        //@ts-expect-error: access private property
        const applicationProviders = grantService.applicationProviders;
        //@ts-expect-error: access private property
        const paymentProviders = grantService.paymentProviders;
        const adapter = jest.fn();
        beforeAll(() => {
            //@ts-expect-error: mock private property
            grantService.fullGrantProviders = { [PROVIDERS[0].provider.id]: { ...PROVIDERS[0], rawToGrant: adapter } };
            //@ts-expect-error: mock private property
            grantService.applicationProviders = {
                [PROVIDERS[1].provider.id]: { ...PROVIDERS[1], rawToApplication: adapter },
            };
            //@ts-expect-error: mock private property
            grantService.paymentProviders = { [PROVIDERS[2].provider.id]: { ...PROVIDERS[2], rawToPayment: adapter } };
        });

        afterEach(() => adapter.mockClear());

        afterAll(() => {
            // @ts-expect-error: restore private property
            grantService.fullGrantProviders = fullGrantProviders;
            // @ts-expect-error: restore private property
            grantService.applicationProviders = applicationProviders;
            // @ts-expect-error: restore private property
            grantService.paymentProviders = paymentProviders;
        });

        it.each`
            grant
            ${FULL_GRANT}
            ${APPLICATION}
            ${PAYMENTS[0]}
        `("should adapte RawFullGrant", ({ grant }) => {
            grantService.adapteRawGrant(grant);
            expect(adapter).toHaveBeenCalledWith(grant);
        });

        // it("should adapte RawFullGrant", () => {
        //     grantService.adapteRawGrant(FULL_GRANT);
        //     expect(adapter).toHaveBeenCalledWith(FULL_GRANT);
        // });

        // it("should adapte RawApplication", () => {
        //     grantService.adapteRawGrant(APPLICATION);
        //     expect(adapter).toHaveBeenCalledWith(FULL_GRANT);
        // });

        // it("should adapte RawPayment", () => {
        //     grantService.adapteRawGrant(PAYMENTS[0]);
        //     expect(adapter).toHaveBeenCalledWith(FULL_GRANT);
        // });
    });

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
            identifierType                    | methodName               | notFoundSirenFromRna | aboutFindingRna     | id
            ${StructureIdentifiersEnum.siret} | ${"getRawGrantsBySiret"} | ${false}             | ${""}               | ${ID}
            ${StructureIdentifiersEnum.siren} | ${"getRawGrantsBySiren"} | ${false}             | ${""}               | ${ID}
            ${StructureIdentifiersEnum.rna}   | ${"getRawGrantsBySiren"} | ${false}             | ${" (siren found)"} | ${SIREN}
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
        testedMethod                     | siret    | not
        ${"getRawGrantsByAssociation"}   | ${false} | ${""}
        ${"getRawGrantsByEstablishment"} | ${true}  | ${" not"}
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

    describe("sendDuplicateMessage", () => {
        it("should call Sentry.captureMessage()", () => {
            // @ts-expect-error: test private method only
            grantService.sendDuplicateMessage(JOIN_KEY_1);
            expect(Sentry.captureMessage).toHaveBeenCalledWith(
                `Duplicate joinKey found for grants or applications :  ${JOIN_KEY_1}`,
            );
        });
    });

    describe("groupRawGrantsByType", () => {
        it("should return grants grouped by type", () => {
            const expected = { fullGrants: [FULL_GRANT], applications: [APPLICATION], payments: PAYMENTS };
            // @ts-expect-error: test private method
            const actual = grantService.groupRawGrantsByType(RAW_GRANTS);
            expect(actual).toEqual(expected);
        });

        it.each`
            rawGrants                     | grantByType
            ${[FULL_GRANT]}               | ${{ fullGrants: [FULL_GRANT], applications: [], payments: [] }}
            ${[FULL_GRANT, APPLICATION]}  | ${{ fullGrants: [FULL_GRANT], applications: [APPLICATION], payments: [] }}
            ${[FULL_GRANT, ...PAYMENTS]}  | ${{ fullGrants: [FULL_GRANT], applications: [], payments: PAYMENTS }}
            ${[APPLICATION, ...PAYMENTS]} | ${{ fullGrants: [], applications: [APPLICATION], payments: PAYMENTS }}
            ${[]}                         | ${{ fullGrants: [], applications: [], payments: [] }}
        `("should set empty array for empty type grant", ({ rawGrants, grantByType }) => {
            const expected = grantByType;
            // @ts-expect-error: test private method
            const actual = grantService.groupRawGrantsByType(rawGrants);
            expect(actual).toEqual(expected);
        });
    });

    // JoinGrants test relies on groupRawGrantsByType return value.
    // Every given param to joinGrants is used to make it seems real
    describe("joinGrants", () => {
        let mockGroupRawGrantsByType: jest.SpyInstance;
        let mockSendDuplicateMessage: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: mock private method
            mockGroupRawGrantsByType = jest.spyOn(grantService, "groupRawGrantsByType");
            mockGroupRawGrantsByType.mockReturnValue(GRANTS_BY_TYPE);
            // @ts-expect-error: mock private method
            mockSendDuplicateMessage = jest.spyOn(grantService, "sendDuplicateMessage");
        });

        afterEach(() => {
            mockGroupRawGrantsByType.mockClear();
            mockSendDuplicateMessage.mockClear();
        });

        afterAll(() => {
            mockGroupRawGrantsByType.mockRestore();
            mockSendDuplicateMessage.mockRestore();
        });

        function testJoinGrants(grants) {
            // @ts-expect-error: test private method
            const actual = grantService.joinGrants(grants);
            expect(actual).toMatchSnapshot();
        }

        it("should call groupRawGrantsByType", () => {
            // @ts-expect-error: test private method
            grantService.joinGrants(RAW_GRANTS);
            expect(mockGroupRawGrantsByType).toBeCalledWith(RAW_GRANTS);
        });

        it("should call sendDuplicateMessage with fullGrants sharing same joinKey", () => {
            mockGroupRawGrantsByType.mockReturnValueOnce({
                fullGrants: [FULL_GRANT, FULL_GRANT],
            });

            // @ts-expect-error: test private method
            grantService.joinGrants([FULL_GRANT, FULL_GRANT]);
            expect(mockSendDuplicateMessage).toHaveBeenCalledWith(FULL_GRANT.joinKey);
        });

        it("should call sendDuplicateMessage with applications sharing same joinKey", () => {
            mockGroupRawGrantsByType.mockReturnValueOnce({
                fullGrants: [APPLICATION, APPLICATION],
            });

            // @ts-expect-error: test private method
            grantService.joinGrants([APPLICATION, APPLICATION]);
            expect(mockSendDuplicateMessage).toHaveBeenCalledWith(APPLICATION.joinKey);
        });

        it("should call sendDuplicateMessage with fullGrant and application sharing same joinKey", () => {
            mockGroupRawGrantsByType.mockReturnValueOnce({
                fullGrants: [FULL_GRANT, { ...APPLICATION, joinKey: FULL_GRANT.joinKey }],
            });

            // @ts-expect-error: test private method
            grantService.joinGrants([FULL_GRANT, { ...APPLICATION, joinKey: FULL_GRANT.joinKey }]);
            expect(mockSendDuplicateMessage).toHaveBeenCalledWith(FULL_GRANT.joinKey);
        });

        it("should return JoinedGrants", () => {
            const expected = [
                { fullGrants: [FULL_GRANT], applications: [], payments: [PAYMENTS[0], PAYMENTS[1]] },
                { fullGrants: [], applications: [APPLICATION], payments: [PAYMENTS[2], PAYMENTS[3]] },
            ];

            // @ts-expect-error: test private method
            const actual = grantService.joinGrants(RAW_GRANTS);
            expect(actual).toEqual(expected);
        });

        it("should return JoinedGrants with lonely grants", () => {
            const LONELY_FULL_GRANT = { ...FULL_GRANT, joinKey: undefined };
            const LONELY_APPLICATION = { ...APPLICATION, joinKey: undefined };
            const LONELY_PAYMENT = { ...PAYMENTS[0], joinKey: undefined };
            const GRANT_BY_TYPE_WITH_LONELY = {
                fullGrants: [FULL_GRANT, LONELY_FULL_GRANT],
                applications: [APPLICATION, LONELY_APPLICATION],
                payments: [...PAYMENTS, LONELY_PAYMENT],
            };
            mockGroupRawGrantsByType.mockReturnValueOnce(GRANT_BY_TYPE_WITH_LONELY);

            const expected: JoinedRawGrant[] = [
                { fullGrants: [FULL_GRANT], applications: [], payments: [PAYMENTS[0], PAYMENTS[1]] },
                { fullGrants: [], applications: [APPLICATION], payments: [PAYMENTS[2], PAYMENTS[3]] },
                { fullGrants: [LONELY_FULL_GRANT], applications: [], payments: [] },
                { fullGrants: [], applications: [LONELY_APPLICATION], payments: [] },
                { fullGrants: [], applications: [], payments: [LONELY_PAYMENT] },
            ];

            // @ts-expect-error: test private method
            const actual = grantService.joinGrants([
                ...RAW_GRANTS,
                LONELY_FULL_GRANT,
                LONELY_APPLICATION,
                LONELY_PAYMENT,
            ]);

            expect(actual).toEqual(expected);
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
