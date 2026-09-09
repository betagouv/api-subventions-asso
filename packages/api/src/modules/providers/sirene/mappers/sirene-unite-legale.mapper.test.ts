import { DBOS, DTOS, ENTITIES } from "../__fixtures__/sirene-unite-legale.fixture";
import SireneUniteLegaleMapper from "./sirene-unite-legale.mapper";

describe("SireneUniteLegaleMapper", () => {
    describe("parquetRowToEntity", () => {
        it("maps native parquet values explicitly", () => {
            const actual = SireneUniteLegaleMapper.parquetRowToEntity({
                ...DTOS[0],
                unknownParquetColumn: "not persisted",
            });

            expect({
                entity: actual,
                dateCreationIsDate: actual.dateCreationUniteLegale instanceof Date,
                lastUpdateIsDate: actual.dateDernierTraitementUniteLegale instanceof Date,
                dboHasUnknownColumn: Object.hasOwn(SireneUniteLegaleMapper.entityToDbo(actual), "unknownParquetColumn"),
            }).toEqual({
                entity: ENTITIES[0],
                dateCreationIsDate: true,
                lastUpdateIsDate: true,
                dboHasUnknownColumn: false,
            });
        });

        it("preserves null values", () => {
            const actual = SireneUniteLegaleMapper.parquetRowToEntity({
                ...DTOS[0],
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

    describe("toEntity", () => {
        it("returns SireneUniteLegaleEntity from DTO", () => {
            const expected = ENTITIES[0];
            const actual = SireneUniteLegaleMapper.toEntity(DTOS[0]);
            expect(actual).toEqual(expected);
        });

        it("returns SireneUniteLegaleEntity from DBO", () => {
            const expected = ENTITIES[0];
            const actual = SireneUniteLegaleMapper.toEntity(DBOS[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("entityToDbo", () => {
        it("maps the entity", () => {
            const { _id, ...expected } = DBOS[0];
            const actual = SireneUniteLegaleMapper.entityToDbo(ENTITIES[0]);

            expect(actual).toEqual(expected);
        });
    });

    describe("entityToUniteLegaleNameEntity", () => {
        it("should return a SireneUniteLegaleEntity", () => {
            const actual = SireneUniteLegaleMapper.entityToUniteLegaleNameEntity(ENTITIES[0]);

            expect(actual).toMatchSnapshot();
        });
    });
});
