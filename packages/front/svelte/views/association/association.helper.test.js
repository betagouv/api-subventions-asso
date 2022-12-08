import * as AssociationHelper from "./association.helper";

const TODAY = new Date();
const YESTERDAY = (function (date) {
    const today = new Date(date);
    today.setDate(today.getDate() - 1);
    return today;
})(TODAY);

console.log(TODAY);
console.log(YESTERDAY);

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

const SIREN = "123456789";
const NIC = "12345";

describe("Association Helper", () => {
    describe("getSiegeSiret()", () => {
        it("should return siret", () => {
            const partialAssociationDto = {
                siren: SIREN,
                nic_siege: NIC
            };
            const expected = SIREN + NIC;
            const actual = AssociationHelper.getSiegeSiret(partialAssociationDto);
            expect(actual).toEqual(expected);
        });
    });

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
});
