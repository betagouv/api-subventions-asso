import { SIRENE_UNITE_LEGALE_DBOS } from "../../../../outputs/db/sirene/__fixtures__/sirene-unite-legale.fixture";
import SireneUniteLegaleMapper from "./sirene-unite-legale.mapper";
import { SIRENE_UNITE_LEGALE_DTOS } from "./__fixtures__/sirene-unite-legale.dto.fixture";

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
});
