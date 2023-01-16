import associationNameService from "../../../../association-name/associationName.service";
import dataGouvService from "../../datagouv.service";
import DataGouvCliController from "./datagouv.cli.controller";
import PartialUniteLegalRaw from "../../__fixtures__/PartialUniteLegalRaw";
import { AssociationRaw } from "../../__fixtures__/AssociationRawFixture";
import { EntrepriseRaw } from "../../__fixtures__/EntrepriseRawFixutre";
import { UniteLegaleHistoriqueAdapter } from "../../adapter/UniteLegaleHistoriqueAdapter";

describe("DataGouv Controller", () => {
    const addAssociationNameMock = jest.spyOn(associationNameService, "upsert").mockImplementation(jest.fn());
    const addManyEntrepriseSirenMock = jest
        .spyOn(dataGouvService, "insertManyEntrepriseSiren")
        .mockImplementation(jest.fn());

    const rawToAssociationNameMock = jest.spyOn(UniteLegaleHistoriqueAdapter, "rawToAssociationName");
    const rawToEntrepriseSirenMock = jest.spyOn(UniteLegaleHistoriqueAdapter as any, "rawToEntrepriseSiren");

    describe("isAssociation()", () => {
        it("should return true", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.isAssociation(AssociationRaw);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const controller = new DataGouvCliController();
            const expected = false;
            // @ts-expect-error: test private method
            const actual = controller.isAssociation(EntrepriseRaw);
            expect(actual).toEqual(expected);
        });
    });

    describe("shouldAssoBeSaved()", () => {
        it("should return true if association denomination has changed", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.shouldAssoBeSaved({
                ...AssociationRaw,
                changementDenominationUniteLegale: "true"
            });
            expect(actual).toEqual(expected);
        });

        it("should return true if association is new", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.shouldAssoBeSaved({
                ...AssociationRaw,
                ...PartialUniteLegalRaw
            });
            expect(actual).toEqual(expected);
        });

        it("should return false if association has changed but not the denomination", () => {
            const controller = new DataGouvCliController();
            const expected = false;
            // @ts-expect-error: test private method
            const actual = controller.shouldAssoBeSaved({
                ...AssociationRaw,
                ...PartialUniteLegalRaw,
                changementEtatAdministratifUniteLegale: "true"
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("isUniteLegaleNew()", () => {
        it("should return true", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.isUniteLegaleNew(PartialUniteLegalRaw);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const controller = new DataGouvCliController();
            const expected = false;
            // @ts-expect-error: test private method
            const actual = controller.isUniteLegaleNew({
                ...PartialUniteLegalRaw,
                changementEtatAdministratifUniteLegale: "true"
            });
            expect(actual).toEqual(expected);
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
            expect(addManyEntrepriseSirenMock).toHaveBeenCalledTimes(1);
        });
    });
});
