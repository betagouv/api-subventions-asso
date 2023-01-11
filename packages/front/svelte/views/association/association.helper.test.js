import DEFAULT_ASSOCIATION from "./__fixtures__/Association";
import * as AssociationHelper from "./association.helper";

const TODAY = new Date();
const YESTERDAY = (function (date) {
    const today = new Date(date);
    today.setDate(today.getDate() - 1);
    return today;
})(TODAY);

const SUBVENTION = {
    isSub: true,
    annee_demande: TODAY.getFullYear()
};

const FONJEP_VERSEMENT = {
    isVersement: true,
    periodDebut: TODAY,
    dateOperation: YESTERDAY
};

const CHORUS_VERSEMENT = {
    isVersement: true,
    dateOperation: YESTERDAY
};

describe("Association Helper", () => {
    describe("getYearOfElement()", () => {
        const TODAY_YEAR = TODAY.getFullYear();
        const YESTERDAY_YEAR = YESTERDAY.getFullYear();

        it.each`
            element             | expected
            ${SUBVENTION}       | ${TODAY_YEAR}
            ${FONJEP_VERSEMENT} | ${TODAY_YEAR}
            ${CHORUS_VERSEMENT} | ${YESTERDAY_YEAR}
        `("should return a year", ({ element, expected }) => {
            const actual = AssociationHelper.getYearOfElement(element);
            expect(actual).toEqual(expected);
        });
    });

    describe("getSubventionYear()", () => {
        it("should return a year", () => {
            const actual = AssociationHelper.getSubventionYear(SUBVENTION);
            expect(actual).toEqual(SUBVENTION.annee_demande);
        });

        it("should return undefined", () => {
            const actual = AssociationHelper.getSubventionYear({ annee_demande: undefined });
            expect(actual).toEqual(undefined);
        });
    });

    describe("getVersementYear()", () => {
        it.each`
            versement           | expected
            ${FONJEP_VERSEMENT} | ${FONJEP_VERSEMENT.periodDebut.getFullYear()}
            ${CHORUS_VERSEMENT} | ${CHORUS_VERSEMENT.dateOperation.getFullYear()}
        `("should return a year", ({ versement, expected }) => {
            const actual = AssociationHelper.getVersementYear(versement);
            expect(actual).toEqual(expected);
        });

        it("should return undefined", () => {
            const actual = AssociationHelper.getVersementYear({
                periodDebut: undefined,
                dateOperation: undefined
            });
            expect(actual).toEqual(undefined);
        });
    });

    describe("getAddress", () => {
        it("should return address from RNA", () => {
            const expected = "15 RUE DE BREST 35000 RENNES";
            const actual = AssociationHelper.getAddress(DEFAULT_ASSOCIATION);
            expect(actual).toEqual(expected);
        });

        it("should return address from RNA", () => {
            const ASSOCIATION = { ...DEFAULT_ASSOCIATION };
            ASSOCIATION.adresse_siege_rna = null;
            const expected = "51 BD JEANNE D'ARC 35700 RENNES";
            const actual = AssociationHelper.getAddress(ASSOCIATION);
            expect(actual).toEqual(expected);
        });

        it("should return null", () => {
            const expected = null;
            const actual = AssociationHelper.getAddress({});
            expect(actual).toEqual(expected);
        });
    });

    describe("addressToString", () => {
        it("should return concatened address", () => {
            const ADDRESS = DEFAULT_ASSOCIATION.adresse_siege_rna;
            const expected = "15 RUE DE BREST 35000 RENNES";
            const actual = AssociationHelper.addressToString(ADDRESS);
            expect(actual).toEqual(expected);
        });
    });
});
