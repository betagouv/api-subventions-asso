import DEFAULT_ASSOCIATION from "./__fixtures__/Association";
import * as AssociationHelper from "./association.helper";
import * as EntrepriseHelper from "$lib/helpers/entrepriseHelper";
vi.mock("$lib/helpers/entrepriseHelper.js");
const mockedEntrepriseHelper = vi.mocked(EntrepriseHelper);

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

    describe("isAssociation()", () => {
        const RNA = "W12345678";
        it("should return true", () => {
            const ASSO = { rna: RNA, categorie_juridique: "" };
            const expected = true;
            const actual = AssociationHelper.isAssociation(ASSO);
            expect(actual).toEqual(expected);
        });

        it("should return true if only rna", () => {
            const ASSO = { rna: RNA };
            const expected = true;
            const actual = AssociationHelper.isAssociation(ASSO);
            expect(actual).toEqual(expected);
        });

        it("should return true if no rna but proper 'categorie_juridique'", () => {
            mockedEntrepriseHelper.isAssoCategory.mockReturnValueOnce(true);
            const ASSO = { categorie_juridique: "" };
            const expected = true;
            const actual = AssociationHelper.isAssociation(ASSO);
            expect(actual).toEqual(expected);
        });

        it("should return false if neither rna nor proper 'categorie_juridique'", () => {
            mockedEntrepriseHelper.isAssoCategory.mockReturnValueOnce(false);
            const ASSO = { categorie_juridique: "" };
            const expected = false;
            const actual = AssociationHelper.isAssociation(ASSO);
            expect(actual).toEqual(expected);
        });
    });

    describe("getEstabStatusBadgeOptions", () => {
        it("should return null", () => {
            const actual = AssociationHelper.getEstabStatusBadgeOptions({});
            const expected = null;
            expect(actual).toEqual(expected);
        });

        it("should return open option", () => {
            const actual = AssociationHelper.getEstabStatusBadgeOptions({ ouvert: true });
            const expected = { label: "Ouvert", type: "success" };
            expect(actual).toEqual(expected);
        });

        it("should return close option", () => {
            const actual = AssociationHelper.getEstabStatusBadgeOptions({ ouvert: false });
            const expected = { label: "Fermé", type: "error" };
            expect(actual).toEqual(expected);
        });
    });
});
