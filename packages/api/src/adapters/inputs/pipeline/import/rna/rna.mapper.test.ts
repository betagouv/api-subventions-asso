import { RNA_DBO } from "../../../../outputs/db/rna/rna.dbo.fixture";
import { RNA_WALDEC_DTO } from "./rna.dto.fixture";
import rnaMapper from "./rna.mapper";

describe("RnaMapper", () => {
    describe("toDbo", () => {
        it("returns dbo", () => {
            const actual = rnaMapper.toDbo(RNA_WALDEC_DTO);
            expect(actual).toMatchSnapshot(actual);
        });
    });

    describe("toAssociationSearch", () => {
        it("returns AssociationSearchDbo", () => {
            const actual = rnaMapper.toAssociationSearch(RNA_DBO);
            expect(actual).toMatchSnapshot();
        });
    });
});
