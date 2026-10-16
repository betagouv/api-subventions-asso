import { SIRENE_UNITE_LEGALE_DBOS } from "./__fixtures__/sirene-unite-legale.fixture";
import SireneUniteLegaleMapper from "./sirene-unite-legale.mapper";

describe("SIRENE Unité Légale Mapper", () => {
    describe("toEntity", () => {
        it("returns entity with RNA as null when RNA is not well formatted", () => {
            const actual = SireneUniteLegaleMapper.toEntity({
                ...SIRENE_UNITE_LEGALE_DBOS[0],
                identifiantAssociationUniteLegale: "W12B12",
            });
            expect(actual).toMatchSnapshot();
        });

        it("returns entity", () => {
            const actual = SireneUniteLegaleMapper.toEntity({
                ...SIRENE_UNITE_LEGALE_DBOS[0],
            });
            expect(actual).toMatchSnapshot();
        });
    });
});
