import { ESTABLISHMENT_DBO } from "./__fixtures__/sirene-establishment.fixture";
import * as mapper from "./sirene-establishment.mapper";

describe("Establishment Mapper", () => {
    describe("toEntity", () => {
        it("returns EstablishmentEntity", () => {
            const actual = mapper.toEntity(ESTABLISHMENT_DBO);
            expect(actual).toMatchSnapshot();
        });
    });
});
