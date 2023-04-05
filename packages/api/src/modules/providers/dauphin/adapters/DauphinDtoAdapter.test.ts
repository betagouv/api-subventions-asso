import DauphinDtoAdapter from "./DauphinDtoAdapter";

const mockLabel = "NORMALIZED_LABEL";
const mockToStatus = jest.fn(() => mockLabel);

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
});
