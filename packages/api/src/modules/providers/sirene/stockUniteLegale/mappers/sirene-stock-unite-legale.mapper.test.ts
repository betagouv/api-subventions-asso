import { DTOS, DBOS, ENTITIES } from "../../__fixtures__/sireneStockUniteLegale.fixture";
import SireneStockUniteLegaleMapper from "./sirene-stock-unite-legale.mapper";

jest.mock("../../../../../dataProviders/db/uniteLegalName/unite-legal-name.mapper", () => ({
    default: class UniteLegalNameMapper {
        static buildSearchKey(a, b) {
            return `${a} +++ ${b}`;
        }
    },
    __esModule: true,
}));

describe("SireneStockUniteLegaleAdapter", () => {
    describe("dtoToEntity", () => {
        it("should return a SireneStockUniteLegaleEntity", () => {
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
        it("should return a SireneStockUniteLegaleEntity", () => {
            const actual = SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity(ENTITIES[0]);
            expect(actual).toMatchSnapshot();
        });
    });
});
