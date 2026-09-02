import { BODACC_RECORD } from "./__fixtures__/bodacc.fixtures";
import { toEntity } from "./bodacc.mapper";

describe("Bodacc Mapper", () => {
    describe("toEntity", () => {
        it("returns BodaccEntity", () => {
            const actual = toEntity(BODACC_RECORD);
            expect(actual).toMatchSnapshot();
        });
    });
});
