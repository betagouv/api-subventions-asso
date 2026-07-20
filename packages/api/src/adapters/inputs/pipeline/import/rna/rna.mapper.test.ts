import { RNA_WALDEC_DTO } from "./rna.dto.fixture";
import rnaMapper from "./rna.mapper";

describe("RnaMapper", () => {
    describe("map", () => {
        it("returns dbo", () => {
            const actual = rnaMapper.map(RNA_WALDEC_DTO);
            expect(actual).toMatchSnapshot(actual);
        });
    });
});
