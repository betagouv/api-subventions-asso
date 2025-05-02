const mockLabel = "NORMALIZED_LABEL";
const mockToStatus = jest.fn(() => mockLabel);

import DauphinDtoAdapter from "./DauphinDtoAdapter";

jest.mock("../../providers.adapter", () => ({
    toStatusFactory: () => mockToStatus,
    __esModule: true, // this property makes it work
}));

describe("DauphinDtoAdapter", () => {
    describe("rawToApplication", () => {
        // @ts-expect-error: parameter type
        const RAW_APPLICATION: RawApplication = { data: { foo: "bar" } };
        // @ts-expect-error: parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };
        let mockToDemandeSubvention: jest.SpyInstance;

        beforeAll(() => {
            mockToDemandeSubvention = jest.spyOn(DauphinDtoAdapter, "toDemandeSubvention");
            mockToDemandeSubvention.mockReturnValue(APPLICATION);
        });

        afterAll(() => {
            mockToDemandeSubvention.mockRestore();
        });

        it("should call toDemandeSubvention", () => {
            DauphinDtoAdapter.rawToApplication(RAW_APPLICATION);
            expect(mockToDemandeSubvention).toHaveBeenCalledWith(RAW_APPLICATION.data);
        });

        it("should return DemandeSubvention", () => {
            const expected = APPLICATION;
            const actual = DauphinDtoAdapter.rawToApplication(RAW_APPLICATION);
            expect(actual).toEqual(expected);
        });
    });

    describe("toDemandeSubvention()", () => {
        const minDauphinEntity = {
            dauphin: {
                history: { begin: {}, events: [] },
                demandeur: { SIRET: {} },
                planFinancement: [],
                financeursPrivilegies: [{ title: "title" }],
            },
        };

        const buildDauphinEntityWithVirtualStatus = virtualStatus => {
            return {
                dauphin: {
                    ...minDauphinEntity.dauphin,
                    virtualStatusLabel: virtualStatus,
                },
            };
        };

        it("generates status translator", () => {
            const PROVIDER_STATUS = "toto";
            // @ts-expect-error: mock
            DauphinDtoAdapter.toDemandeSubvention(buildDauphinEntityWithVirtualStatus(PROVIDER_STATUS));
            expect(mockToStatus).toBeCalledWith(PROVIDER_STATUS);
        });

        it("uses status translator", () => {
            const PROVIDER_STATUS = "toto";
            // @ts-expect-error: mock
            const res = DauphinDtoAdapter.toDemandeSubvention(buildDauphinEntityWithVirtualStatus(PROVIDER_STATUS));
            const actual = res?.statut_label?.value;
            expect(actual).toBe(mockLabel);
        });
    });

    describe("toDocuments", () => {
        const DAUPHIN_DOC = [
            {
                libelle: { value: "test1" },
                documents: [
                    {
                        id: "/path1",
                        title: "title1",
                        expand: { properties: { "entity:document:date": { value: "2022-02-01" } } },
                    },
                    {
                        id: "/path2",
                        title: "title2",
                        expand: { properties: { "entity:document:date": { value: "2022-02-01" } } },
                    },
                ],
            },
            {
                libelle: { value: "test1" },
                documents: [
                    {
                        id: "/path1",
                        title: "title1",
                        expand: { properties: { "entity:document:date": { value: "2022-02-01" } } },
                    },
                    {
                        id: "/path2",
                        title: "title2",
                        expand: { properties: { "entity:document:date": { value: "2022-02-01" } } },
                    },
                ],
            },
        ];

        // not really unit test but don't know how to do otherwise
        it("return proper result", () => {
            // @ts-expect-error -- mock
            const actual = DauphinDtoAdapter.toDocuments(DAUPHIN_DOC);
            expect(actual).toMatchSnapshot();
        });

        it("ignore docs with errors", () => {
            const actual = DauphinDtoAdapter.toDocuments([
                {
                    libelle: { value: "test1" },
                    documents: [
                        {
                            id: "/path2",
                            title: "title2",
                            // @ts-expect-error -- mock
                            error: "something",
                        },
                    ],
                },
            ]);
            expect(actual).toMatchInlineSnapshot(`[]`);
        });
    });

    describe("toCommon", () => {
        it("returns proper result", () => {
            // @ts-expect-error: mock
            jest.spyOn(DauphinDtoAdapter, "getMontantDemande").mockReturnValueOnce(43);
            // @ts-expect-error: mock
            jest.spyOn(DauphinDtoAdapter, "getMontantAccorde").mockReturnValueOnce(42);
            // @ts-expect-error: mock
            jest.spyOn(DauphinDtoAdapter, "getInstructorService").mockReturnValueOnce("Service");

            const INPUT = {
                dauphin: {
                    exerciceBudgetaire: 2022,
                    intituleProjet: "projet",
                    demandeur: { SIRET: { complet: "123456789" } },
                    thematique: { title: "titre" },
                },
            };
            // @ts-expect-error mock
            const actual = DauphinDtoAdapter.toCommon(INPUT);
            expect(actual).toMatchSnapshot();
        });
    });
});
