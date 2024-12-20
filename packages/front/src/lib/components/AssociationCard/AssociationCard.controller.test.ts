import AssociationCardController from "./AssociationCard.controller";
import * as AssociationHelper from "$lib/resources/associations/association.helper";
vi.mock("$lib/resources/associations/association.helper");

const RNA = "W123456789";
const SIREN = "987654321";

describe("AssociationCardController", () => {
    describe("getters", () => {
        describe("url", () => {
            const simplifiedAssoWithOnlyRna = { rna: RNA, sien: null, address: {}, categorie_juridique: "9210" };
            const simplifiedAssoWithOnlySiren = { rna: null, siren: SIREN, address: {}, categorie_juridique: "9210" };
            const simplifiedAssoWithBothIdentifier = {
                rna: RNA,
                siren: SIREN,
                address: {},
                categorie_juridique: "9210",
            };

            it.each`
                simplifiedAsso                      | expectedIdentifier | identifierName
                ${simplifiedAssoWithOnlyRna}        | ${RNA}             | ${"RNA"}
                ${simplifiedAssoWithOnlySiren}      | ${SIREN}           | ${"SIREN"}
                ${simplifiedAssoWithBothIdentifier} | ${RNA}             | ${"RNA"}
            `("should return url with $identifierName", ({ simplifiedAsso, expectedIdentifier }) => {
                const ctrl = new AssociationCardController(simplifiedAsso, "");
                const expected = `/association/${expectedIdentifier}`;
                const actual = ctrl.url;
                expect(actual).toEqual(expected);
            });
        });

        describe("street", () => {
            it("should call getFirstPartAddress()", () => {
                const simplifiedAsso = { rna: RNA, address: {} };
                const ctrl = new AssociationCardController(simplifiedAsso, "");
                ctrl.street;
                expect(AssociationHelper.getFirstPartAddress).toHaveBeenCalledOnce();
            });
        });

        describe("city", () => {
            it("should call getLastPartAddress()", () => {
                const simplifiedAsso = { rna: RNA, address: {} };
                const ctrl = new AssociationCardController(simplifiedAsso, "");
                ctrl.city;
                expect(AssociationHelper.getLastPartAddress).toHaveBeenCalledOnce();
            });
        });

        describe("nbEtabsLabel", () => {
            it("should return none", () => {
                const simplifiedAsso = { rna: RNA, address: {}, nbEtabs: 0 };
                const ctrl = new AssociationCardController(simplifiedAsso, "");
                const expected = "aucun établissement rattaché";
                const actual = ctrl.nbEtabsLabel;
                expect(actual).toEqual(expected);
            });

            it("should return singular", () => {
                const simplifiedAsso = { rna: RNA, address: {}, nbEtabs: 1 };
                const ctrl = new AssociationCardController(simplifiedAsso, "");
                const expected = "1 établissement rattaché";
                const actual = ctrl.nbEtabsLabel;
                expect(actual).toEqual(expected);
            });

            it("should return plural", () => {
                const simplifiedAsso = { rna: RNA, address: {}, nbEtabs: 4 };
                const ctrl = new AssociationCardController(simplifiedAsso, "");
                const expected = "4 établissements rattachés";
                const actual = ctrl.nbEtabsLabel;
                expect(actual).toEqual(expected);
            });
        });
    });
});
