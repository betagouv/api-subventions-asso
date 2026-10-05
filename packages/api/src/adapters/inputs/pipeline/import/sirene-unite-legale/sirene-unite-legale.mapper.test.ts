import { SIRENE_UNITE_LEGALE_DBOS } from "../../../../outputs/db/sirene/__fixtures__/sirene-unite-legale.fixture";
import SireneUniteLegaleMapper from "./sirene-unite-legale.mapper";
import { SIRENE_UNITE_LEGALE_DTOS } from "./__fixtures__/sirene-unite-legale.dto.fixture";
import DEFAULT_ASSOCIATION from "../../../../../../tests/__fixtures__/association.fixture";

describe("SireneUniteLegale Mapper", () => {
    describe("toAssociationSearch", () => {
        it("maps to partial AssociationSearchDbo", () => {
            const actual = SireneUniteLegaleMapper.toAssociationSearch(SIRENE_UNITE_LEGALE_DBOS[0]);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("toDbo", () => {
        it("maps to dbo", () => {
            const actual = SireneUniteLegaleMapper.toDbo(SIRENE_UNITE_LEGALE_DTOS[0]);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("getRna", () => {
        it("returns null if value is not defined", () => {
            const expected = null;
            // @ts-expect-error: test private method
            const actual = SireneUniteLegaleMapper.getRna(null);
            expect(actual).toEqual(expected);
        });

        it("returns null if value is not valid", () => {
            const expected = null;
            // @ts-expect-error: test private method
            const actual = SireneUniteLegaleMapper.getRna("W12BN");
            expect(actual).toEqual(expected);
        });

        it("returns value if value is valid", () => {
            const expected = DEFAULT_ASSOCIATION.rna;
            // @ts-expect-error: test private method
            const actual = SireneUniteLegaleMapper.getRna(DEFAULT_ASSOCIATION.rna);
            expect(actual).toEqual(expected);
        });
    });
});
