import { RNA_DBO } from "../../../../outputs/db/rna/rna.dbo.fixture";
import { RNA_WALDEC_DTO } from "./rna.dto.fixture";
import rnaMapper from "./rna.mapper";

describe("RnaMapper", () => {
    describe("map", () => {
        it("returns dbo", () => {
            const actual = rnaMapper.map(RNA_WALDEC_DTO);
            expect(actual).toMatchSnapshot(actual);
        });
    });

    describe("toAssociationSearch", () => {
        it("throws an error if no titre provided", () => {
            // @ts-expect-error: bypass type check
            expect(() => rnaMapper.toAssociationSearch({ ...RNA_DBO, titre: null })).toThrow(
                "RnaDbo must contain titre to be transformed into AssociationSearch",
            );
        });
    });
});
