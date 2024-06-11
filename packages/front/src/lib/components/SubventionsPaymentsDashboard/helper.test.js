import * as Helper from "./helper";

const TODAY = new Date();
const YESTERDAY = (function (date) {
    const today = new Date(date);
    today.setDate(today.getDate() - 1);
    return today;
})(TODAY);

const SUBVENTION = {
    isSub: true,
    annee_demande: TODAY.getFullYear(),
};

const FONJEP_VERSEMENT = {
    isPayment: true,
    periodDebut: TODAY,
    dateOperation: YESTERDAY,
};

const CHORUS_VERSEMENT = {
    isPayment: true,
    dateOperation: YESTERDAY,
};

describe("helper", () => {
    describe("getYearOfElement()", () => {
        const TODAY_YEAR = TODAY.getFullYear();
        const YESTERDAY_YEAR = YESTERDAY.getFullYear();

        it.each`
            element             | expected
            ${SUBVENTION}       | ${TODAY_YEAR}
            ${FONJEP_VERSEMENT} | ${TODAY_YEAR}
            ${CHORUS_VERSEMENT} | ${YESTERDAY_YEAR}
        `("should return a year", ({ element, expected }) => {
            const actual = Helper.getYearOfElement(element);
            expect(actual).toEqual(expected);
        });
    });

    describe("getSubventionYear()", () => {
        it("should return a year", () => {
            const actual = Helper.getSubventionYear(SUBVENTION);
            expect(actual).toEqual(SUBVENTION.annee_demande);
        });

        it("should return undefined", () => {
            const actual = Helper.getSubventionYear({ annee_demande: undefined });
            expect(actual).toBeUndefined();
        });
    });

    describe("getPaymentYear()", () => {
        it.each`
            payment             | expected
            ${FONJEP_VERSEMENT} | ${FONJEP_VERSEMENT.periodDebut.getFullYear()}
            ${CHORUS_VERSEMENT} | ${CHORUS_VERSEMENT.dateOperation.getFullYear()}
        `("should return a year", ({ payment, expected }) => {
            const actual = Helper.getPaymentYear(payment);
            expect(actual).toEqual(expected);
        });

        it("should return undefined", () => {
            const actual = Helper.getPaymentYear({
                periodDebut: undefined,
                dateOperation: undefined,
            });
            expect(actual).toBeUndefined();
        });
    });
});
