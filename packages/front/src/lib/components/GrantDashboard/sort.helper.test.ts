import { beforeAll } from "vitest";
import { ApplicationStatus } from "dto";
import { grantCompareBuilder, nullIsLowCmpBuilder, statusAmountCmp } from "$lib/components/GrantDashboard/sort.helper";

describe("sortHelper", () => {
    describe("nullIsLowCmpBuilder", () => {
        const INITIAL_CMP_FN = vi.fn();
        let RES_FN;

        beforeAll(() => {
            RES_FN = nullIsLowCmpBuilder(INITIAL_CMP_FN);
        });

        it.each`
            a            | b            | expected | orderInt | order
            ${1}         | ${undefined} | ${-1}    | ${1}     | ${"ASC"}
            ${undefined} | ${1}         | ${1}     | ${1}     | ${"ASC"}
            ${undefined} | ${undefined} | ${0}     | ${1}     | ${"ASC"}
            ${1}         | ${undefined} | ${-1}    | ${-1}    | ${"DESC"}
            ${undefined} | ${1}         | ${1}     | ${-1}    | ${"DESC"}
            ${undefined} | ${undefined} | ${0}     | ${-1}    | ${"DESC"}
        `("checks undefined in both places, in $order order", ({ a, b, expected, orderInt }) => {
            const actual = RES_FN(a, b, orderInt);
            expect(actual).toBe(expected);
        });

        it("does not call compare function if undefined somewhere", () => {
            RES_FN(1, undefined, 1);
            expect(INITIAL_CMP_FN).not.toHaveBeenCalled();
        });

        it("returns result from compare function", () => {
            const expected = 42;
            INITIAL_CMP_FN.mockReturnValueOnce(expected);
            const actual = RES_FN(1, 2, 1);
            expect(INITIAL_CMP_FN).toHaveBeenCalledWith(1, 2);
            expect(actual).toBe(expected);
        });

        it("returns opposite of compare function if negative orderInt", () => {
            const expected = 42;
            INITIAL_CMP_FN.mockReturnValueOnce(-1 * expected);
            const actual = RES_FN(1, 2, -1);
            expect(INITIAL_CMP_FN).toHaveBeenCalledWith(1, 2);
            expect(actual).toBe(expected);
        });
    });

    describe("statusAmountCmp", () => {
        it.each`
            a | b | expected
            ${{ montantAccorde: undefined, status: ApplicationStatus.GRANTED }} | ${{
    montantAccorde: undefined,
    status: ApplicationStatus.GRANTED,
}} | ${0}
            ${{ montantAccorde: undefined, status: ApplicationStatus.GRANTED }} | ${{
    montantAccorde: 1,
    status: ApplicationStatus.GRANTED,
}} | ${-1}
            ${{ montantAccorde: undefined, status: ApplicationStatus.REFUSED }} | ${{
    montantAccorde: undefined,
    status: ApplicationStatus.GRANTED,
}} | ${-1}
            ${{ montantAccorde: 42, status: ApplicationStatus.GRANTED }} | ${{
    montantAccorde: 0,
    status: ApplicationStatus.GRANTED,
}} | ${42}
            ${{ montantAccorde: 0, status: ApplicationStatus.GRANTED }} | ${{
    montantAccorde: 42,
    status: ApplicationStatus.GRANTED,
}} | ${-42}
            ${{ montantAccorde: 1, status: ApplicationStatus.REFUSED }} | ${{
    montantAccorde: undefined,
    status: ApplicationStatus.PENDING,
}} | ${1}
        `("returns proper comparison", ({ a, b, expected }) => {
            const actual = statusAmountCmp(a, b, 1);
            expect(actual).toBe(expected);
        });
    });

    describe("grantCompareBuilder's result", () => {
        it("compares proper attributes with proper function", () => {
            const CMP = vi.fn();
            const GETTER = vi.fn();
            const A = "A";
            const B = "B";
            GETTER.mockReturnValueOnce("a");
            GETTER.mockReturnValueOnce("b");

            const builtCompareFn = grantCompareBuilder<string>(CMP, GETTER);
            builtCompareFn(A, B, 1);
            expect(GETTER).toHaveBeenCalledWith(A);
            expect(GETTER).toHaveBeenCalledWith(B);
            expect(CMP).toHaveBeenCalledWith("a", "b", 1);
        });
    });
});
