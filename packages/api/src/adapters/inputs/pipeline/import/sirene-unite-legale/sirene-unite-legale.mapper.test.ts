import { SIRENE_UNITE_LEGAL_ENTITIES } from "../../../../../domain/__fixtures__/unite-legale.fixture";
import dbSireneUniteLegaleMapper from "../../../../outputs/db/sirene/sirene-unite-legale.mapper";
import { SIRENE_UNITE_LEGALE_DTOS } from "./__fixtures__/sirene-unite-legale.dto.fixture";
import SireneUniteLegaleMapper from "./sirene-unite-legale.mapper";

describe("parquetRowToEntity", () => {
    it("maps native parquet values explicitly", () => {
        const actual = SireneUniteLegaleMapper.parquetRowToEntity({
            ...SIRENE_UNITE_LEGALE_DTOS[0],
            unknownParquetColumn: "not persisted",
        });

        expect({
            entity: actual,
            dateCreationIsDate: actual.dateCreationUniteLegale instanceof Date,
            lastUpdateIsDate: actual.dateDernierTraitementUniteLegale instanceof Date,
            dboHasUnknownColumn: Object.hasOwn(dbSireneUniteLegaleMapper.entityToDbo(actual), "unknownParquetColumn"),
        }).toEqual({
            entity: SIRENE_UNITE_LEGAL_ENTITIES[0],
            dateCreationIsDate: true,
            lastUpdateIsDate: true,
            dboHasUnknownColumn: false,
        });
    });

    it("preserves null values", () => {
        const actual = SireneUniteLegaleMapper.parquetRowToEntity({
            ...SIRENE_UNITE_LEGALE_DTOS[0],
            dateCreationUniteLegale: null,
            dateDebut: null,
            anneeEffectifsUniteLegale: null,
            nombrePeriodesUniteLegale: null,
            anneeCategorieEntreprise: null,
            categorieJuridiqueUniteLegale: null,
        });

        expect({
            dateCreationUniteLegale: actual.dateCreationUniteLegale,
            dateDebut: actual.dateDebut,
            anneeEffectifsUniteLegale: actual.anneeEffectifsUniteLegale,
            nombrePeriodesUniteLegale: actual.nombrePeriodesUniteLegale,
            anneeCategorieEntreprise: actual.anneeCategorieEntreprise,
            categorieJuridiqueUniteLegale: actual.categorieJuridiqueUniteLegale,
        }).toEqual({
            dateCreationUniteLegale: null,
            dateDebut: null,
            anneeEffectifsUniteLegale: null,
            nombrePeriodesUniteLegale: null,
            anneeCategorieEntreprise: null,
            categorieJuridiqueUniteLegale: null,
        });
    });
});
