import { ENTITIES, DBOS, DTOS } from "../__fixtures__/sirene-unite-legale.fixture";
import SireneStockUniteLegaleMapper from "./sirene-unite-legale.mapper";

jest.mock("../../../../adapters/outputs/db/unite-legale-name/unite-legale-name.mapper", () => ({
    default: class UniteLegalNameMapper {
        static buildSearchKey(a, b) {
            return `${a} +++ ${b}`;
        }
    },
    __esModule: true,
}));

describe("SireneUniteLegaleAdapter", () => {
    describe("dtoToEntity", () => {
        it("should return a SireneUniteLegaleEntity", () => {
            const expected = ENTITIES[0];
            const actual = SireneStockUniteLegaleMapper.dtoToEntity(DTOS[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("entityToDbo", () => {
        it("should return a SireneUniteLegaleDbo", () => {
            const { _id, ...expected } = DBOS[0];
            const actual = SireneStockUniteLegaleMapper.entityToDbo(ENTITIES[0]);
            expect(actual).toEqual({ ...expected });
        });
    });

    describe("entityToUniteLegaleNameEntity", () => {
        it("should return a SireneUniteLegaleEntity", () => {
            const actual = SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity(ENTITIES[0]);
            expect(actual).toMatchSnapshot();
        });
    });
});
