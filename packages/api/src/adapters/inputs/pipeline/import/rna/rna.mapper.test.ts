import { RNA_DBO } from "../../../../outputs/db/rna/rna.dbo.fixture";
import { RNA_WALDEC_DTO } from "./rna.dto.fixture";
import rnaMapper from "./rna.mapper";
import DEFAULT_ASSOCIATION from "../../../../../../tests/__fixtures__/association.fixture";

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

    describe("getSiren", () => {
        it("returns null if undefined", () => {
            const expected = null;
            // @ts-expect-error: test private method
            const actual = rnaMapper.getSiren(null);
            expect(actual).toEqual(expected);
        });

        it("returns null if string is neither a siren or a siret", () => {
            const expected = null;
            // @ts-expect-error: test private method
            const actual = rnaMapper.getSiren("1234A");
            expect(actual).toEqual(expected);
        });

        it("returns siren if string is a siret", () => {
            const expected = DEFAULT_ASSOCIATION.siren;
            // @ts-expect-error: test private method
            const actual = rnaMapper.getSiren(DEFAULT_ASSOCIATION.siret);
            expect(actual).toEqual(expected);
        });

        it("returns siren if string is a siren", () => {
            const expected = DEFAULT_ASSOCIATION.siren;
            // @ts-expect-error: test private method
            const actual = rnaMapper.getSiren(DEFAULT_ASSOCIATION.siren);
            expect(actual).toEqual(expected);
        });
    });
});
