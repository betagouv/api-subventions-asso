import AssociationNameEntity from "../../../association-name/entities/AssociationNameEntity";
import dataGouvService from "../datagouv.service";
import EntrepriseSirenEntity from "../entities/EntrepriseSirenEntity";
import { AssociationRaw } from "../__fixtures__/AssociationRawFixture";
import { EntrepriseRaw } from "../__fixtures__/EntrepriseRawFixutre";
import { UniteLegaleHistoriqueAdapter } from "./UniteLegaleHistoriqueAdapter";

describe("UniteLegaleHistoriqueAdapter", () => {
    describe("rawToAssociationName", () => {
        it("should return AssociationNameEntity", () => {
            const expected = new AssociationNameEntity(
                null,
                AssociationRaw.denominationUniteLegale,
                dataGouvService.provider.name,
                new Date(AssociationRaw.dateDebut),
                AssociationRaw.siren,
            );
            const actual = UniteLegaleHistoriqueAdapter.rawToAssociationName(AssociationRaw);
            expect(actual).toEqual(expected);
        });
    });

    describe("rawToEntrepriseSiren", () => {
        it("should return rawToEntrepriseSiren", () => {
            const expected = new EntrepriseSirenEntity(EntrepriseRaw.siren);
            const actual = UniteLegaleHistoriqueAdapter.rawToEntrepriseSiren(EntrepriseRaw);
            expect(actual).toEqual(expected);
        });
    });
});
