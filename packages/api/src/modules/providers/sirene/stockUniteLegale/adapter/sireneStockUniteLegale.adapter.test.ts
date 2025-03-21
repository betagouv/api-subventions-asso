import { ObjectId } from "mongodb";
import { DTOS, DBOS, ENTITIES } from "../../__fixtures__/sireneStockUniteLegale.fixture";
import SireneStockUniteLegaleAdapter from "../adapter/sireneStockUniteLegale.adapter";

jest.mock("../../../../../dataProviders/db/uniteLegalName/UniteLegalName.adapter", () => ({
    default: class UniteLegalNameAdapter {
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
            const actual = SireneStockUniteLegaleAdapter.dtoToEntity(DTOS[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("entityToDbo", () => {
        it("should return a SireneUniteLegaleDbo", () => {
            const expected = DBOS[0];
            const actual = SireneStockUniteLegaleAdapter.entityToDbo(ENTITIES[0]);
            expect(actual).toEqual({ ...expected, _id: expect.any(ObjectId) });
        });
    });

    describe("entityToUniteLegaleNameEntity", () => {
        it("should return a SireneStockUniteLegaleEntity", () => {
            const actual = SireneStockUniteLegaleAdapter.entityToUniteLegaleNameEntity(ENTITIES[0]);
            expect(actual).toMatchSnapshot();
        });
    });
});
