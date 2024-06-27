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
import { AnyRawGrant, JoinedRawGrant, RawApplication, RawFullGrant, RawPayment } from "./@types/rawGrant";
import * as Sentry from "@sentry/node";
import {
    applicationProvidersFixtures,
    fullGrantProvidersFixtures,
    paymentProvidersFixtures,
} from "../providers/__fixtures__/providers.fixture";
import providers, * as ProvidersIndex from "../providers";
import * as ProviderMock from "../providers/__mocks__";
import scdlService from "../providers/scdl/scdl.service";
import scdlGrantService from "../providers/scdl/scdl.grant.service";
import { application } from "express";
import { DemandeSubvention, Grant, Payment } from "dto";
import { SIRET } from "../../../tests/__fixtures__/association.fixture";
jest.mock("../providers/scdl/scdl.service");

jest.mock("@sentry/node");
jest.mock("../providers");
jest.mock("../../shared/Validators");
jest.mock("../../shared/helpers/IdentifierHelper");
jest.mock("./commonGrant.service");
jest.mock("../associations/associations.service");
jest.mock("../../shared/helpers/SirenHelper");

describe("GrantService", () => {
    const SCDL_PRODUCER_NAME = "SCDL_PRODUCER_NAME";
    beforeAll(() => {
        scdlService.producerNames = [SCDL_PRODUCER_NAME];
    });

    const JOINED = "JOINED";

    const JOIN_KEY_1 = "JOIN_KEY_1";
    const JOIN_KEY_2 = "JOIN_KEY_2";
    const RAW_FULL_GRANT: RawFullGrant = {
        provider: fullGrantProvidersFixtures[0].provider.id,
        data: { application: {}, payments: [] },
        type: "fullGrant",
        joinKey: JOIN_KEY_1,
    };
    const RAW_APPLICATION: RawApplication = {
        provider: applicationProvidersFixtures[0].provider.id,
        data: {},
        type: "application",
        joinKey: JOIN_KEY_2,
    };
    const RAW_PAYMENTS: RawPayment[] = [
        { provider: paymentProvidersFixtures[0].provider.id, data: {}, type: "payment", joinKey: JOIN_KEY_1 },
        { provider: paymentProvidersFixtures[0].provider.id, data: {}, type: "payment", joinKey: JOIN_KEY_1 },
        { provider: paymentProvidersFixtures[0].provider.id, data: {}, type: "payment", joinKey: JOIN_KEY_2 },
        { provider: paymentProvidersFixtures[0].provider.id, data: {}, type: "payment", joinKey: JOIN_KEY_2 },
    ];
    const RAW_GRANTS: AnyRawGrant[] = [RAW_FULL_GRANT, RAW_APPLICATION, ...RAW_PAYMENTS];
    const GRANTS_BY_TYPE = {
        fullGrants: [RAW_FULL_GRANT],
        applications: [RAW_APPLICATION],
        payments: RAW_PAYMENTS,
    };

    const DEFAULT_JOINED_RAW_GRANT = {
        fullGrants: [RAW_FULL_GRANT],
        applications: [],
        payments: RAW_PAYMENTS.filter(rawPayment => rawPayment.joinKey === RAW_FULL_GRANT.joinKey),
    };
    // @ts-expect-error: mock type
    const APPLICATION = { siret: SIRET } as DemandeSubvention;
    // @ts-expect-error: mock type
    const PAYMENTS = [{ bop: 163 }, { bop: 147 }] as Payment[];
    // @ts-expect-error: mock type
    const GRANT: Grant = { application: APPLICATION, payments: [{ bop: 101 } as Payment] };

    describe("adapteRawGrant", () => {
        beforeAll(() => {
            grantService.fullGrantProvidersById = {
                [fullGrantProvidersFixtures[0].provider.id]: fullGrantProvidersFixtures[0],
            };
            grantService.applicationProvidersById = {
                [applicationProvidersFixtures[0].provider.id]: applicationProvidersFixtures[0],
                [applicationProvidersFixtures[1].provider.id]: applicationProvidersFixtures[1],
            };
            grantService.paymentProvidersById = {
                [paymentProvidersFixtures[0].provider.id]: paymentProvidersFixtures[0],
            };
        });

        it.each`
            grant              | provider                           | method
            ${RAW_FULL_GRANT}  | ${fullGrantProvidersFixtures[0]}   | ${"rawToGrant"}
            ${RAW_APPLICATION} | ${applicationProvidersFixtures[0]} | ${"rawToApplication"}
            ${RAW_PAYMENTS[0]} | ${paymentProvidersFixtures[0]}     | ${"rawToPayment"}
        `("should adapte RawFullGrant", ({ grant, provider, method }) => {
            grantService.adapteRawGrant(grant);
            expect(provider[method]).toHaveBeenCalledWith(grant);
        });

        it("should handle SCDL case", () => {
            const oldScdlGrantServiceId = scdlGrantService.provider.id;
            // Use for SCDL adapteRawGrant specific treatment
            scdlGrantService.provider.id = applicationProvidersFixtures[1].provider.id;
            const APPLICATION_SCDL: RawApplication = {
                provider: SCDL_PRODUCER_NAME,
                data: {},
                type: "application",
                joinKey: JOIN_KEY_2,
            };
            grantService.adapteRawGrant(APPLICATION_SCDL);
            expect(applicationProvidersFixtures[1].rawToApplication).toHaveBeenCalledWith(APPLICATION_SCDL);
            scdlGrantService.provider.id = oldScdlGrantServiceId;
        });
    });

    describe("adapteJoinedRawGrant", () => {
        let mockToGrant, mockAdapteRawGrant;

        beforeAll(() => {
            mockToGrant = jest.spyOn(grantService, "toGrant").mockReturnValue(GRANT);
            // @ts-expect-error: mock return value
            mockAdapteRawGrant = jest.spyOn(grantService, "adapteRawGrant").mockImplementation(rawGrant => rawGrant);
        });

        afterEach(() => {
            mockAdapteRawGrant.mockClear();
            mockToGrant.mockClear();
        });

        afterAll(() => {
            mockToGrant.mockRestore();
            mockAdapteRawGrant.mockRestore();
        });

        it.each`
            arrayName                                  | joinedRawGrant                                                                                                                                               | calls
            ${"payments"}                              | ${{ fullGrants: [], applications: [], payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]] }}                                                                        | ${2}
            ${"fullGrants"}                            | ${{ fullGrants: [RAW_FULL_GRANT, {} as RawFullGrant], applications: [], payments: [] }}                                                                      | ${2}
            ${"application"}                           | ${{ fullGrants: [], applications: [RAW_APPLICATION, {} as RawApplication], payments: [] }}                                                                   | ${2}
            ${"payments, fullGrants and applications"} | ${{ fullGrants: [RAW_FULL_GRANT, {} as RawFullGrant], applications: [RAW_APPLICATION, {} as RawApplication], payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]] }} | ${6}
        `("should call adapteRawGrant for each $arrayName", ({ joinedRawGrant, calls }) => {
            grantService.adapteJoinedRawGrant(joinedRawGrant);
            expect(mockAdapteRawGrant).toHaveBeenCalledTimes(calls);
        });

        it("should call toGrant", () => {
            grantService.adapteJoinedRawGrant(DEFAULT_JOINED_RAW_GRANT);
            expect(mockToGrant).toHaveBeenCalledWith(DEFAULT_JOINED_RAW_GRANT);
        });
    });

    describe("toGrant", () => {
        it.each`
            description                                     | joinedRawGrant                                                                                  | expected
            ${"return undefined if no param"}               | ${undefined}                                                                                    | ${undefined}
            ${"return undefined with empty object"}         | ${{}}                                                                                           | ${undefined}
            ${"return undefined with properties undefined"} | ${{ fullGrants: undefined, applications: undefined, payments: undefined }}                      | ${undefined}
            ${"return undefined with empty arrays"}         | ${{ fullGrants: [], applications: [], payments: [] }}                                           | ${undefined}
            ${"return only payments"}                       | ${{ fullGrants: [], applications: [], payments: PAYMENTS }}                                     | ${{ application: null, payments: PAYMENTS }}
            ${"return first grant + payments"}              | ${{ fullGrants: [GRANT, {} as Grant], applications: [], payments: PAYMENTS }}                   | ${{ application: GRANT.application, payments: [...(GRANT.payments as Payment[]), ...PAYMENTS] }}
            ${"return first application + payments"}        | ${{ fullGrants: [], applications: [APPLICATION, {} as DemandeSubvention], payments: PAYMENTS }} | ${{ application: APPLICATION, payments: PAYMENTS }}
            ${"return first grant"}                         | ${{ fullGrants: [GRANT, {} as Grant], applications: [], payments: [] }}                         | ${GRANT}
            ${"return first application"}                   | ${{ fullGrants: [], applications: [APPLICATION, {} as DemandeSubvention], payments: [] }}       | ${{ application: APPLICATION, payments: null }}
        `("$description", ({ joinedRawGrant, expected }) => {
            const grant = grantService.toGrant(joinedRawGrant);
            expect(grant).toEqual(expected);
        });
    });

    describe("sortGrants", () => {
        const LONLEY_PAYMENT = { application: null, payments: PAYMENTS };
        const LONELY_APPLICATION = { application: APPLICATION, payments: null };
        it.each`
            grants
            ${[LONELY_APPLICATION, GRANT, LONLEY_PAYMENT]}
            ${[LONLEY_PAYMENT, GRANT, LONELY_APPLICATION]}
            ${[GRANT, LONLEY_PAYMENT, LONELY_APPLICATION]}
            ${[GRANT, LONELY_APPLICATION, LONLEY_PAYMENT]}
            ${[LONELY_APPLICATION, LONLEY_PAYMENT, GRANT]}
            ${[LONLEY_PAYMENT, LONELY_APPLICATION, GRANT]}
        `("should sort grants with full grants first", ({ grants }) => {
            const expected = [GRANT, LONELY_APPLICATION, LONLEY_PAYMENT];
            const actual = grantService.sortGrants(grants);
            console.log(actual);
            expect(actual).toEqual(expected);
        });
    });

    describe("getGrants", () => {
        const JOINED_RAW_GRANTS = [DEFAULT_JOINED_RAW_GRANT, {}];
        let mockGetRawGrants, mockAdapteJoinedRawGrant, mockSortGrants;
        beforeAll(() => {
            mockGetRawGrants = jest.spyOn(grantService, "getRawGrants").mockResolvedValue(JOINED_RAW_GRANTS);
            mockAdapteJoinedRawGrant = jest.spyOn(grantService, "adapteJoinedRawGrant").mockReturnValue(GRANT);
            mockSortGrants = jest.spyOn(grantService, "sortGrants").mockImplementation(arr => arr);
        });

        afterAll(() => {
            mockGetRawGrants.mockRestore();
            mockAdapteJoinedRawGrant.mockRestore();
            mockSortGrants.mockRestore();
        });

        it("should call getRawGrants", async () => {
            await grantService.getGrants(SIRET);
            expect(mockGetRawGrants).toHaveBeenCalledWith(SIRET);
        });
        it("should call adapteJoinedRawGrant", async () => {
            await grantService.getGrants(SIRET);
            expect(mockAdapteJoinedRawGrant).toHaveBeenCalledTimes(JOINED_RAW_GRANTS.length);
        });
        it("should call sortGrants", async () => {
            await grantService.getGrants(SIRET);
            expect(mockSortGrants).toHaveBeenCalledWith([GRANT, GRANT]);
        });
    });

    describe("getRawGrants", () => {
        const SIREN = "123456789";
        const RNA = "W1234567";
        let getSirenMock, joinGrantsMock;
        let mockedProviders: any;
        let mockValidateAndGetIdentifierInfo: jest.SpyInstance;
        const ID = "ID";

        // const cleanProviders = providers.grantProviders as GrantProvider[];
        // const paymentProvider = (providers.grantProviders as GrantProvider[]).find(
        //     provider => provider.isPaymentProvider,
        // );

        beforeAll(() => {
            getSirenMock = jest.spyOn(rnaSirenService, "find").mockResolvedValue([new RnaSirenEntity(RNA, SIREN)]);
            joinGrantsMock = jest.spyOn(grantService as any, "joinGrants").mockReturnValue(JOINED);
            mocked(associationsService.isSirenFromAsso).mockResolvedValue(true);
            // @ts-expect-error: private method
            mockValidateAndGetIdentifierInfo = jest.spyOn(grantService, "validateAndGetIdentifierInfo");
            mockValidateAndGetIdentifierInfo.mockReturnValue({
                identifier: SIREN,
                type: StructureIdentifiersEnum.siren,
            });
            mockedProviders = ProvidersIndex.grantProviders;
        });

        afterEach(() => {
            mockedProviders.forEach(provider => {
                provider.getRawGrantsBySiret.mockClear();
                provider.getRawGrantsBySiren.mockClear();
            });
        });

        afterAll(() => {
            getSirenMock.mockRestore();
            joinGrantsMock.mockRestore();
            mockValidateAndGetIdentifierInfo.mockRestore();
        });

        it("identifies identifier type", async () => {
            await grantService.getRawGrants(SIREN);
            expect(mockValidateAndGetIdentifierInfo).toHaveBeenCalledWith(SIREN);
        });

        it("throws if incorrect identifier", async () => {
            mockValidateAndGetIdentifierInfo.mockReturnValueOnce(null);
            const test = () => grantService.getRawGrants(SIREN);
            await expect(test).rejects.toThrow();
        });

        it.each`
            identifierType                    | methodName               | id
            ${StructureIdentifiersEnum.siret} | ${"getRawGrantsBySiret"} | ${ID}
            ${StructureIdentifiersEnum.siren} | ${"getRawGrantsBySiren"} | ${ID}
        `(
            "calls appropriate method of provider by $identifierType$aboutFindingRna",
            async ({ identifierType, methodName, id }) => {
                mocked(mockValidateAndGetIdentifierInfo).mockReturnValueOnce({ identifier: ID, type: identifierType });
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
            const expected = { fullGrants: [RAW_FULL_GRANT], applications: [RAW_APPLICATION], payments: RAW_PAYMENTS };
            // @ts-expect-error: test private method
            const actual = grantService.groupRawGrantsByType(RAW_GRANTS);
            expect(actual).toEqual(expected);
        });

        it.each`
            rawGrants                             | grantByType
            ${[RAW_FULL_GRANT]}                   | ${{ fullGrants: [RAW_FULL_GRANT], applications: [], payments: [] }}
            ${[RAW_FULL_GRANT, RAW_APPLICATION]}  | ${{ fullGrants: [RAW_FULL_GRANT], applications: [RAW_APPLICATION], payments: [] }}
            ${[RAW_FULL_GRANT, ...RAW_PAYMENTS]}  | ${{ fullGrants: [RAW_FULL_GRANT], applications: [], payments: RAW_PAYMENTS }}
            ${[RAW_APPLICATION, ...RAW_PAYMENTS]} | ${{ fullGrants: [], applications: [RAW_APPLICATION], payments: RAW_PAYMENTS }}
            ${[]}                                 | ${{ fullGrants: [], applications: [], payments: [] }}
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

        it("should call groupRawGrantsByType", () => {
            // @ts-expect-error: test private method
            grantService.joinGrants(RAW_GRANTS);
            expect(mockGroupRawGrantsByType).toBeCalledWith(RAW_GRANTS);
        });

        it("should call sendDuplicateMessage with fullGrants sharing same joinKey", () => {
            mockGroupRawGrantsByType.mockReturnValueOnce({
                fullGrants: [RAW_FULL_GRANT, RAW_FULL_GRANT],
            });

            // @ts-expect-error: test private method
            grantService.joinGrants([RAW_FULL_GRANT, RAW_FULL_GRANT]);
            expect(mockSendDuplicateMessage).toHaveBeenCalledWith(RAW_FULL_GRANT.joinKey);
        });

        it("should call sendDuplicateMessage with applications sharing same joinKey", () => {
            mockGroupRawGrantsByType.mockReturnValueOnce({
                fullGrants: [RAW_APPLICATION, RAW_APPLICATION],
            });

            // @ts-expect-error: test private method
            grantService.joinGrants([RAW_APPLICATION, RAW_APPLICATION]);
            expect(mockSendDuplicateMessage).toHaveBeenCalledWith(RAW_APPLICATION.joinKey);
        });

        it("should call sendDuplicateMessage with fullGrant and application sharing same joinKey", () => {
            mockGroupRawGrantsByType.mockReturnValueOnce({
                fullGrants: [RAW_FULL_GRANT, { ...RAW_APPLICATION, joinKey: RAW_FULL_GRANT.joinKey }],
            });

            // @ts-expect-error: test private method
            grantService.joinGrants([RAW_FULL_GRANT, { ...RAW_APPLICATION, joinKey: RAW_FULL_GRANT.joinKey }]);
            expect(mockSendDuplicateMessage).toHaveBeenCalledWith(RAW_FULL_GRANT.joinKey);
        });

        it("should return JoinedGrants", () => {
            const expected = [
                { fullGrants: [RAW_FULL_GRANT], applications: [], payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]] },
                { fullGrants: [], applications: [RAW_APPLICATION], payments: [RAW_PAYMENTS[2], RAW_PAYMENTS[3]] },
            ];

            // @ts-expect-error: test private method
            const actual = grantService.joinGrants(RAW_GRANTS);
            expect(actual).toEqual(expected);
        });

        it("should return JoinedGrants with lonely grants", () => {
            const LONELY_FULL_GRANT = { ...RAW_FULL_GRANT, joinKey: undefined };
            const LONELY_APPLICATION = { ...RAW_APPLICATION, joinKey: undefined };
            const LONELY_PAYMENT = { ...RAW_PAYMENTS[0], joinKey: undefined };
            const GRANT_BY_TYPE_WITH_LONELY = {
                fullGrants: [RAW_FULL_GRANT, LONELY_FULL_GRANT],
                applications: [RAW_APPLICATION, LONELY_APPLICATION],
                payments: [...RAW_PAYMENTS, LONELY_PAYMENT],
            };
            mockGroupRawGrantsByType.mockReturnValueOnce(GRANT_BY_TYPE_WITH_LONELY);

            const expected: JoinedRawGrant[] = [
                { fullGrants: [RAW_FULL_GRANT], applications: [], payments: [RAW_PAYMENTS[0], RAW_PAYMENTS[1]] },
                { fullGrants: [], applications: [RAW_APPLICATION], payments: [RAW_PAYMENTS[2], RAW_PAYMENTS[3]] },
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
