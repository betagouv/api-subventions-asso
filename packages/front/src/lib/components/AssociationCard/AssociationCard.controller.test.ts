import AssociationCardController from "./AssociationCard.controller";
import * as AssociationHelper from "$lib/resources/associations/association.helper";
import type { RechercheAssociationDto } from "dto";
vi.mock("$lib/resources/associations/association.helper");

const RNA = "W123456789";
const SIREN = "987654321";

describe("AssociationCardController", () => {
    const SIMPLIFIED_ASSO = { rna: RNA, adresse: {}, nbEtabs: 1 } as unknown as RechercheAssociationDto;
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
                const ctrl = new AssociationCardController(SIMPLIFIED_ASSO, "");
                // TODO: #3374
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                ctrl.street;
                expect(AssociationHelper.getFirstPartAddress).toHaveBeenCalledOnce();
            });
        });

        describe("city", () => {
            it("should call getLastPartAddress()", () => {
                const ctrl = new AssociationCardController(SIMPLIFIED_ASSO, "");
                // TODO: #3374
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                ctrl.city;
                expect(AssociationHelper.getLastPartAddress).toHaveBeenCalledOnce();
            });
        });

        describe("nbEtabsLabel", () => {
            it("should return none", () => {
                const ctrl = new AssociationCardController({ ...SIMPLIFIED_ASSO, nbEtabs: 0 }, "");
                const expected = "aucun établissement rattaché";
                const actual = ctrl.nbEtabsLabel;
                expect(actual).toEqual(expected);
            });

            it("should return singular", () => {
                const ctrl = new AssociationCardController(SIMPLIFIED_ASSO, "");
                const expected = "1 établissement rattaché";
                const actual = ctrl.nbEtabsLabel;
                expect(actual).toEqual(expected);
            });

            it("should return plural", () => {
                const ctrl = new AssociationCardController({ ...SIMPLIFIED_ASSO, nbEtabs: 4 }, "");
                const expected = "4 établissements rattachés";
                const actual = ctrl.nbEtabsLabel;
                expect(actual).toEqual(expected);
            });
        });
    });
});
