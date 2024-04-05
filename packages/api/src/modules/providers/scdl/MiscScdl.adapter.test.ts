import MiscScdlAdapter from "./MiscScdl.adapter";
import ENTITY from "./__fixtures__/MiscScdlGrantProducer";
import { ApplicationStatus } from "dto";

describe("MiscScdlAdapter", () => {
    describe("_multiannuality", () => {
        it.each`
            parameter
            ${"paymentEndDate"}
            ${"paymentStartDate"}
        `("returns 'Non' if no $parameter", ({ parameter }) => {
            const expected = "Non";
            // @ts-expect-error - private method
            const actual = MiscScdlAdapter._multiannuality({
                ...ENTITY,
                [parameter]: undefined,
            });
            expect(actual).toBe(expected);
        });

        it("returns 'Oui' if more than a year apart", () => {
            const expected = "Oui";
            // @ts-expect-error - private method and type
            const actual = MiscScdlAdapter._multiannuality({
                ...ENTITY,
                paymentStartDate: new Date("2023-06-01"),
                paymentEndDate: new Date("2024-07-01"),
            });
            expect(actual).toBe(expected);
        });

        it("returns 'Non' if less than a year apart", () => {
            const expected = "Non";
            // @ts-expect-error - private method and type
            const actual = MiscScdlAdapter._multiannuality({
                ...ENTITY,
                paymentStartDate: new Date("2023-06-01"),
                paymentEndDate: new Date("2024-05-01"),
            });
            expect(actual).toBe(expected);
        });
    });

    describe("_status", () => {
        it.each`
            amount | status
            ${0}   | ${ApplicationStatus.REFUSED}
            ${42}  | ${ApplicationStatus.GRANTED}
        `("sets status: $status", ({ amount, status: expected }) => {
            // @ts-expect-error - private method
            const actual = MiscScdlAdapter._status({ ...ENTITY, amount });
            expect(actual).toBe(expected);
        });
    });

    describe("toCommon", () => {
        it("adapts properly", () => {
            const actual = MiscScdlAdapter.toCommon(ENTITY);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("toDemandeSubvention", () => {
        it("adapts properly", () => {
            const actual = MiscScdlAdapter.toDemandeSubvention(ENTITY);
            expect(actual).toMatchSnapshot();
        });
    });
});
