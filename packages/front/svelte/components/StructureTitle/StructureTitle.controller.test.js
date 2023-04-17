import * as associationHelper from "../../views/association/association.helper";
import { StructureTitleController } from "./StructureTitle.controller";

describe("StructureTitleController", () => {
    const ASSO = {
        rna: "W000000000",
        siren: "100000000",
        denomination_rna: "nom_rna",
        denomination_siren: "nom_siren",
        nic_siege: "00000",
    };
    const ETAB_SIRET = "10000000000000";
    const controllerAsso = new StructureTitleController(ASSO);
    const controllerEtab = new StructureTitleController(ASSO, ETAB_SIRET);
    const mockBuildSiret = jest.spyOn(associationHelper, "getSiegeSiret");

    beforeAll(() => mockBuildSiret.mockReturnValue(ETAB_SIRET));

    describe.each`
        controller        | isEtab
        ${controllerAsso} | ${false}
        ${controllerEtab} | ${true}
    `("common tests with etab and asso", ({ controller, isEtab }) => {
        it("should have proper identifiers", () => {
            const expected = { rna: "W000000000", siren: "100000000" };
            const actual = { rna: controller.rna, siren: controller.siren };
            expect(actual).toEqual(expected);
        });

        it("hasActionButton relays whether etab case or not", () => {
            const expected = isEtab;
            const actual = controller.hasActionButton;
            expect(actual).toEqual(expected);
        });
    });

    // SUBTITLE
    it("should have no subtitle when no siret given", () => {
        const actual = controllerAsso.subtitle;
        expect(actual).toBeUndefined();
    });

    it("should have association name in subtitle if siret given", () => {
        const actual = controllerEtab.subtitle;
        const expected = ASSO.denomination_rna;
        expect(actual).toBe(expected);
    });

    // TITLE
    it("title shows association name", () => {
        const actual = controllerAsso.title;
        const expected = `Association : ${ASSO.denomination_rna}`;
        expect(actual).toBe(expected);
    });

    it("title shows primary etablissement", () => {
        const actual = controllerEtab.title;
        const expected = "Établissement siège de l'association";
        expect(actual).toBe(expected);
    });

    it("title shows secondary etablissement", () => {
        mockBuildSiret.mockReturnValueOnce(false);
        const controller = new StructureTitleController(ASSO, ETAB_SIRET);
        const actual = controller.title;
        const expected = "Établissement secondaire de l'association";
        expect(actual).toBe(expected);
    });

    // IDENTIFIERS
    it("hyphens unknown identifiers", () => {
        const controller = new StructureTitleController({ denomination_rna: "nom" });
        const expected = { rna: "-", siren: "-" };
        const actual = { rna: controller.rna, siren: controller.siren };
        expect(actual).toEqual(expected);
    });

    // LINK TO ASSO
    it("is empty for associations", () => {
        const actual = controllerAsso.linkToAsso;
        expect(actual).toBeUndefined();
    });

    it("is correct for establishments", () => {
        const actual = controllerEtab.linkToAsso;
        const expected = "/association/100000000";
        expect(actual).toBe(expected);
    });
});
