import path from "path";
import associationNameRepository from "../../../../src/modules/association-name/repositories/associationName.repository";
import DataGouvCliController from "../../../../src/modules/providers/datagouv/interfaces/cli/datagouv.cli.controller"
import entrepriseSirenRepository from "../../../../src/modules/providers/datagouv/repositories/entreprise_siren.repository";

describe("datagouv", () => {
    const upsertAssociationNameMock = jest.spyOn(associationNameRepository, "upsert");
    const upsertEntrepriseSirenMock = jest.spyOn(entrepriseSirenRepository, "insertMany");
    const controller = new DataGouvCliController();
    describe("parse", () => {
        it("should save associationNames", async () => {
            await controller.parse(path.resolve(__dirname, "./__fixtures__/StockUniteLegaleHistorique.csv"), "2022-11-07");
            expect(upsertAssociationNameMock).toHaveBeenCalledTimes(3);
        });

        it("should save entrepriseSirens", async () => {
            await controller.parse(path.resolve(__dirname, "./__fixtures__/StockUniteLegaleHistorique.csv"), "2022-11-07");
            expect(upsertEntrepriseSirenMock).toHaveBeenCalledTimes(1);
        });
    });
});
