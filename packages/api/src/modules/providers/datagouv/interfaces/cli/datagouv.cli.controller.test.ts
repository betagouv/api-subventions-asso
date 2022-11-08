import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../../shared/LegalCategoriesAccepted";
import associationNameService from "../../../../association-name/associationName.service";
import AssociationNameEntity from "../../../../association-name/entities/AssociationNameEntity";
import { UniteLegalHistoryRaw } from "../../@types/UniteLegalHistoryRaw";
import dataGouvService from "../../datagouv.service";
import EntrepriseSirenEntity from "../../entities/EntrepriseSirenEntity";
import DataGouvCliController from "./datagouv.cli.controller";

const PartialNewUniteLegal = {
    changementEtatAdministratifUniteLegale: "false",
    changementNomUniteLegale: "false",
    changementNomUsageUniteLegale: "false",
    changementDenominationUniteLegale: "false",
    changementDenominationUsuelleUniteLegale: "false",
    changementCategorieJuridiqueUniteLegale: "false",
    changementActivitePrincipaleUniteLegale: "false",
    changementNicSiegeUniteLegale: "false",
    changementEconomieSocialeSolidaireUniteLegale: "false",
    changementSocieteMissionUniteLegale: "false",
    changementCaractereEmployeurUniteLegale: "false"
}

const AssociationRaw = {
    siren: "000000001",
    denominationUniteLegale: "DENOMINATION",
    categorieJuridiqueUniteLegale: Number(LEGAL_CATEGORIES_ACCEPTED[0]),
    dateDebut: (new Date()).toISOString()
} as UniteLegalHistoryRaw

const EntrepriseRaw = {
    siren: "000000000",
    categorieJuridiqueUniteLegale: 1001,
    dateDebut: (new Date()).toISOString()
} as UniteLegalHistoryRaw


describe("DataGouv Controller", () => {
    const addAssociationNameMock = jest.spyOn(associationNameService, "upsert").mockImplementation(jest.fn());
    const addEntrepriseSirenMock = jest.spyOn(dataGouvService, "addEntrepriseSiren").mockImplementation(jest.fn());

    const rawToAssociationNameMock = jest.spyOn(DataGouvCliController.prototype as any, "rawToAssociationName");
    const rawToEntrepriseSirenMock = jest.spyOn(DataGouvCliController.prototype as any, "rawToEntrepriseSiren");

    describe("isAssociation()", () => {
        it("should return true", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.isAssociation(AssociationRaw)
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const controller = new DataGouvCliController();
            const expected = false;
            // @ts-expect-error: test private method
            const actual = controller.isAssociation(EntrepriseRaw)
            expect(actual).toEqual(expected);
        });
    });

    describe("shouldAssoBeSaved()", () => {
        it("should return true if association denomination has changed", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.shouldAssoBeSaved({ ...AssociationRaw, changementDenominationUniteLegale: "true" });
            expect(actual).toEqual(expected);
        });

        it("should return true if association is new", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.shouldAssoBeSaved({ ...AssociationRaw, ...PartialNewUniteLegal });
            expect(actual).toEqual(expected);
        });

        it("should return false if association has changed but not the denomination", () => {
            const controller = new DataGouvCliController();
            const expected = false;
            // @ts-expect-error: test private method
            const actual = controller.shouldAssoBeSaved({ ...AssociationRaw, ...PartialNewUniteLegal, changementEtatAdministratifUniteLegale: "true" });
            expect(actual).toEqual(expected);
        });
    })

    describe("isUniteLegaleNew()", () => {
        it("should return true", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.isUniteLegaleNew(PartialNewUniteLegal);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const controller = new DataGouvCliController();
            const expected = false;
            // @ts-expect-error: test private method
            const actual = controller.isUniteLegaleNew({ ...PartialNewUniteLegal, changementEtatAdministratifUniteLegale: "true" });
            expect(actual).toEqual(expected);
        })
    });

    describe("rawToAssociationName", () => {
        it("should return AssociationNameEntity", () => {
            const controller = new DataGouvCliController();
            const expected = new AssociationNameEntity(null, AssociationRaw.denominationUniteLegale, dataGouvService.provider.name, new Date(AssociationRaw.dateDebut), AssociationRaw.siren);
            // @ts-expect-error: test private method
            const actual = controller.rawToAssociationName(AssociationRaw);
            expect(actual).toEqual(expected)
        });
    });

    describe("rawToEntrepriseSiren", () => {
        it("should return rawToEntrepriseSiren", () => {
            const controller = new DataGouvCliController();
            const expected = new EntrepriseSirenEntity(EntrepriseRaw.siren);
            // @ts-expect-error: test private method
            const actual = controller.rawToEntrepriseSiren(EntrepriseRaw);
            expect(actual).toEqual(expected)
        });
    });

    describe("saveAssociations()", () => {
        it("should transform raws to associationNames", async () => {
            const controller = new DataGouvCliController();
            const expected = 1;
            // @ts-expect-error: test private method
            await controller.saveAssociations([AssociationRaw]);
            const actual = rawToAssociationNameMock.mock.calls.length;
            expect(actual).toEqual(expected);
        });

        it("should save associationNames", async () => {
            const controller = new DataGouvCliController();
            // @ts-expect-error: test private method
            await controller.saveAssociations([AssociationRaw, AssociationRaw]);
            expect(addAssociationNameMock).toHaveBeenCalledTimes(2);
        });
    });

    describe("saveEntreprises()", () => {
        it("should transform raws to entrepriseSiren", async () => {
            const controller = new DataGouvCliController();
            // @ts-expect-error: test private method
            await controller.saveEntreprises([EntrepriseRaw]);
            expect(rawToEntrepriseSirenMock).toHaveBeenCalledTimes(1);
        });

        it("should save entrepriseSirens", async () => {
            const controller = new DataGouvCliController();
            // @ts-expect-error: test private method
            await controller.saveEntreprises([EntrepriseRaw, EntrepriseRaw]);
            expect(addEntrepriseSirenMock).toHaveBeenCalledTimes(2);
        });
    })
});