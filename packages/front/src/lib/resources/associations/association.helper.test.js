import DEFAULT_ASSOCIATION from "./__fixtures__/Association";
import * as AssociationHelper from "./association.helper";

describe("Association Helper", () => {
    describe("getAddress", () => {
        it("should return address from RNA", () => {
            const expected = DEFAULT_ASSOCIATION.adresse_siege_rna;
            const actual = AssociationHelper.getAddress(DEFAULT_ASSOCIATION);
            expect(actual).toEqual(expected);
        });

        it("should return address from SIREN", () => {
            const NO_RNA_ADDRESS = { ...DEFAULT_ASSOCIATION, adresse_siege_rna: undefined };
            const expected = DEFAULT_ASSOCIATION.adresse_siege_siren;
            const actual = AssociationHelper.getAddress(NO_RNA_ADDRESS);
            expect(actual).toEqual(expected);
        });

        it("should return null", () => {
            const expected = null;
            const actual = AssociationHelper.getAddress({});
            expect(actual).toEqual(expected);
        });
    });

    describe("addressToOneLineString", () => {
        it("should return concatenated address", () => {
            const ADDRESS = DEFAULT_ASSOCIATION.adresse_siege_rna;
            const expected = "15 RUE DE BREST 35000 RENNES";
            const actual = AssociationHelper.addressToOneLineString(ADDRESS);
            expect(actual).toEqual(expected);
        });
    });

    describe("getImmatriculation", () => {
        it("should return immatriculation from RNA", () => {
            const expected = DEFAULT_ASSOCIATION.date_creation_rna;
            const actual = AssociationHelper.getImmatriculation({
                date_creation_rna: DEFAULT_ASSOCIATION.date_creation_rna,
            });
            expect(actual).toEqual(expected);
        });

        it("should return immatriculation from SIREN", () => {
            const expected = DEFAULT_ASSOCIATION.date_creation_siren;
            const actual = AssociationHelper.getImmatriculation({
                date_creation_siren: DEFAULT_ASSOCIATION.date_creation_siren,
            });
            expect(actual).toEqual(expected);
        });

        it("should return null", () => {
            const expected = null;
            const actual = AssociationHelper.getImmatriculation({});
            expect(actual).toEqual(expected);
        });
    });

    describe("getModification", () => {
        it("should return immatriculation from RNA", () => {
            const expected = DEFAULT_ASSOCIATION.date_creation_rna;
            const actual = AssociationHelper.getImmatriculation({
                date_creation_rna: DEFAULT_ASSOCIATION.date_creation_rna,
            });
            expect(actual).toEqual(expected);
        });

        it("should return immatriculation from SIREN", () => {
            const expected = DEFAULT_ASSOCIATION.date_creation_siren;
            const actual = AssociationHelper.getImmatriculation({
                date_creation_siren: DEFAULT_ASSOCIATION.date_creation_siren,
            });
            expect(actual).toEqual(expected);
        });

        it("should return null", () => {
            const expected = null;
            const actual = AssociationHelper.getImmatriculation({});
            expect(actual).toEqual(expected);
        });
    });
});
