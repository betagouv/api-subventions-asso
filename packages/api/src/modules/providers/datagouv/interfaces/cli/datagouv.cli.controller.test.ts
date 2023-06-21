import associationNameService from "../../../../association-name/associationName.service";
import dataGouvService from "../../datagouv.service";
import DataGouvCliController from "./datagouv.cli.controller";
import PartialUniteLegalRow from "../../__fixtures__/PartialUniteLegalRow";
import { AssociationRow } from "../../__fixtures__/AssociationRowFixture";
import { EntrepriseRow } from "../../__fixtures__/EntrepriseRowFixture";
import { UniteLegaleHistoriqueAdapter } from "../../adapter/UniteLegaleHistoriqueAdapter";

describe("DataGouv Controller", () => {
    const addAssociationNameMock = jest.spyOn(associationNameService, "upsert").mockImplementation(jest.fn());
    const addManyEntrepriseSirenMock = jest
        .spyOn(dataGouvService, "insertManyEntrepriseSiren")
        .mockImplementation(jest.fn());

    const rowToAssociationNameMock = jest.spyOn(UniteLegaleHistoriqueAdapter, "rowToAssociationName");
    const rowToEntrepriseSirenMock = jest.spyOn(UniteLegaleHistoriqueAdapter as any, "rowToEntrepriseSiren");

    describe("isAssociation()", () => {
        it("should return true", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.isAssociation(AssociationRow);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const controller = new DataGouvCliController();
            const expected = false;
            // @ts-expect-error: test private method
            const actual = controller.isAssociation(EntrepriseRow);
            expect(actual).toEqual(expected);
        });
    });

    describe("shouldAssoBeSaved()", () => {
        it("should return true if association denomination has changed", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.shouldAssoBeSaved({
                ...AssociationRow,
                changementDenominationUniteLegale: "true",
            });
            expect(actual).toEqual(expected);
        });

        it("should return true if association is new", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.shouldAssoBeSaved({
                ...AssociationRow,
                ...PartialUniteLegalRow,
            });
            expect(actual).toEqual(expected);
        });

        it("should return false if association has changed but not the denomination", () => {
            const controller = new DataGouvCliController();
            const expected = false;
            // @ts-expect-error: test private method
            const actual = controller.shouldAssoBeSaved({
                ...AssociationRow,
                ...PartialUniteLegalRow,
                changementEtatAdministratifUniteLegale: "true",
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("isUniteLegaleNew()", () => {
        it("should return true", () => {
            const controller = new DataGouvCliController();
            const expected = true;
            // @ts-expect-error: test private method
            const actual = controller.isUniteLegaleNew(PartialUniteLegalRow);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const controller = new DataGouvCliController();
            const expected = false;
            // @ts-expect-error: test private method
            const actual = controller.isUniteLegaleNew({
                ...PartialUniteLegalRow,
                changementEtatAdministratifUniteLegale: "true",
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("saveAssociations()", () => {
        it("should transform rows to associationNames", async () => {
            const controller = new DataGouvCliController();
            const expected = 1;
            // @ts-expect-error: test private method
            await controller.saveAssociations([AssociationRow]);
            const actual = rowToAssociationNameMock.mock.calls.length;
            expect(actual).toEqual(expected);
        });

        it("should save associationNames", async () => {
            const controller = new DataGouvCliController();
            // @ts-expect-error: test private method
            await controller.saveAssociations([AssociationRow, AssociationRow]);
            expect(addAssociationNameMock).toHaveBeenCalledTimes(2);
        });
    });

    describe("saveEntreprises()", () => {
        it("should transform rows to entrepriseSiren", async () => {
            const controller = new DataGouvCliController();
            // @ts-expect-error: test private method
            await controller.saveEntreprises([EntrepriseRow]);
            expect(rowToEntrepriseSirenMock).toHaveBeenCalledTimes(1);
        });

        it("should save entrepriseSirens", async () => {
            const controller = new DataGouvCliController();
            // @ts-expect-error: test private method
            await controller.saveEntreprises([EntrepriseRow, EntrepriseRow]);
            expect(addManyEntrepriseSirenMock).toHaveBeenCalledTimes(1);
        });
    });
});
