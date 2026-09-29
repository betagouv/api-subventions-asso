import AssociationItemController from "./AssociationItem.controller";
import * as AssociationHelper from "$lib/resources/associations/association.helper";
vi.mock("$lib/resources/associations/association.helper");

const RNA = "W123456789";
const SIREN = "987654321";

describe("AssociationItemController", () => {
    describe("getters", () => {
        describe("url", () => {
            const simplifiedAssoWithOnlyRna = { rna: RNA, siren: null, adresse: {}, categorie_juridique: "9210" };
            const simplifiedAssoWithOnlySiren = { rna: null, siren: SIREN, adresse: {}, categorie_juridique: "9210" };
            const simplifiedAssoWithBothIdentifier = {
                rna: RNA,
                siren: SIREN,
                adresse: {},
                categorie_juridique: "9210",
            };

            it.each`
                simplifiedAsso                      | expectedIdentifier | identifierName
                ${simplifiedAssoWithOnlyRna}        | ${RNA}             | ${"RNA"}
                ${simplifiedAssoWithOnlySiren}      | ${SIREN}           | ${"SIREN"}
                ${simplifiedAssoWithBothIdentifier} | ${RNA}             | ${"RNA"}
            `("should return url with $identifierName", ({ simplifiedAsso, expectedIdentifier }) => {
                const ctrl = new AssociationItemController(simplifiedAsso, "");
                const expected = `/association/${expectedIdentifier}`;
                const actual = ctrl.url;
                expect(actual).toEqual(expected);
            });

            it("should return url with SIREN when search key is RNA", () => {
                const ctrl = new AssociationItemController(simplifiedAssoWithBothIdentifier, RNA);
                const expected = `/association/${SIREN}`;
                const actual = ctrl.url;
                expect(actual).toEqual(expected);
            });

            it("should return url with RNA when search key is SIREN", () => {
                const ctrl = new AssociationItemController(simplifiedAssoWithBothIdentifier, SIREN);
                const expected = `/association/${RNA}`;
                const actual = ctrl.url;
                expect(actual).toEqual(expected);
            });
        });

        describe("street", () => {
            it("should call getFirstPartAddress()", () => {
                const simplifiedAsso = { rna: RNA, adresse: {} };
                const ctrl = new AssociationItemController(simplifiedAsso, "");
                // TODO: #3374
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                ctrl.street;
                expect(AssociationHelper.getFirstPartAddress).toHaveBeenCalledOnce();
            });
        });

        describe("city", () => {
            it("should call getLastPartAddress()", () => {
                const simplifiedAsso = { rna: RNA, adresse: {} };
                const ctrl = new AssociationItemController(simplifiedAsso, "");
                // TODO: #3374
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                ctrl.city;
                expect(AssociationHelper.getLastPartAddress).toHaveBeenCalledOnce();
            });
        });

        describe("nbEtabsLabel", () => {
            it("should return none", () => {
                const simplifiedAsso = { rna: RNA, adresse: {}, nbEtabs: 0 };
                const ctrl = new AssociationItemController(simplifiedAsso, "");
                const expected = "aucun établissement rattaché";
                const actual = ctrl.nbEtabsLabel;
                expect(actual).toEqual(expected);
            });

            it("should return singular", () => {
                const simplifiedAsso = { rna: RNA, adresse: {}, nbEtabs: 1 };
                const ctrl = new AssociationItemController(simplifiedAsso, "");
                const expected = "1 établissement rattaché";
                const actual = ctrl.nbEtabsLabel;
                expect(actual).toEqual(expected);
            });

            it("should return plural", () => {
                const simplifiedAsso = { rna: RNA, adresse: {}, nbEtabs: 4 };
                const ctrl = new AssociationItemController(simplifiedAsso, "");
                const expected = "4 établissements rattachés";
                const actual = ctrl.nbEtabsLabel;
                expect(actual).toEqual(expected);
            });
        });
    });
});
