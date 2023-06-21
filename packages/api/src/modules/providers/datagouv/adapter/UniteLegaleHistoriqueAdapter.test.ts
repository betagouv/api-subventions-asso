import AssociationNameEntity from "../../../association-name/entities/AssociationNameEntity";
import dataGouvService from "../datagouv.service";
import EntrepriseSirenEntity from "../entities/EntrepriseSirenEntity";
import { AssociationRow } from "../__fixtures__/AssociationRowFixture";
import { EntrepriseRow } from "../__fixtures__/EntrepriseRowFixture";
import { UniteLegaleHistoriqueAdapter } from "./UniteLegaleHistoriqueAdapter";

describe("UniteLegaleHistoriqueAdapter", () => {
    describe("rowToAssociationName", () => {
        it("should return AssociationNameEntity", () => {
            const expected = new AssociationNameEntity(
                null,
                AssociationRow.denominationUniteLegale,
                dataGouvService.provider.name,
                new Date(AssociationRow.dateDebut),
                AssociationRow.siren,
            );
            const actual = UniteLegaleHistoriqueAdapter.rowToAssociationName(AssociationRow);
            expect(actual).toEqual(expected);
        });
    });

    describe("rowToEntrepriseSiren", () => {
        it("should return rowToEntrepriseSiren", () => {
            const expected = new EntrepriseSirenEntity(EntrepriseRow.siren);
            const actual = UniteLegaleHistoriqueAdapter.rowToEntrepriseSiren(EntrepriseRow);
            expect(actual).toEqual(expected);
        });
    });
});
