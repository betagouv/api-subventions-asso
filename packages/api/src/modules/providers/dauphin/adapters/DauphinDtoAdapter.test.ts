const mockLabel = "NORMALIZED_LABEL";
const mockToStatus = jest.fn(() => mockLabel);

import DauphinDtoAdapter from "./DauphinDtoAdapter";

jest.mock("../../helper", () => ({
    toStatusFactory: () => mockToStatus,
    __esModule: true, // this property makes it work
}));

describe("DauphinDtoAdapter", () => {
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
    });
});
