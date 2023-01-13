import rnaSirenRepository from "./repositories/rnaSiren.repository";
import rnaSirenService from "./rnaSiren.service";

describe("rnaSiren", () => {
    describe("getGroupedIdentifiers", () => {
        const findByRnaMock: jest.SpyInstance = jest.spyOn(rnaSirenRepository, "findByRna");
        const findBySirenMock: jest.SpyInstance = jest.spyOn(rnaSirenRepository, "findBySiren");

        it("should throw error", async () => {
            await expect(() => rnaSirenService.getGroupedIdentifiers("toto")).rejects.toThrowError(
                "identifier type is not supported"
            );
        });

        it("should return just RNA", async () => {
            findByRnaMock.mockImplementationOnce(async rna => ({ rna }));
            const RNA = "W123456789";
            const expected = { rna: RNA, siren: undefined };
            const actual = await rnaSirenService.getGroupedIdentifiers(RNA);

            expect(actual).toEqual(expected);
        });

        it("should return RNA and SIREN (Identifier is RNA)", async () => {
            const RNA = "W123456789";
            const SIREN = "123456789";
            findByRnaMock.mockImplementationOnce(async rna => ({ rna, siren: SIREN }));
            const expected = { rna: RNA, siren: SIREN };
            const actual = await rnaSirenService.getGroupedIdentifiers(RNA);

            expect(actual).toEqual(expected);
        });

        it("should return just SIREN", async () => {
            findBySirenMock.mockImplementationOnce(async siren => ({ siren }));
            const SIREN = "123456789";
            const expected = { rna: undefined, siren: SIREN };
            const actual = await rnaSirenService.getGroupedIdentifiers(SIREN);

            expect(actual).toEqual(expected);
        });

        it("should return RNA and SIREN (Identifier is SIREN)", async () => {
            const RNA = "W123456789";
            const SIREN = "123456789";
            findBySirenMock.mockImplementationOnce(async siren => ({ rna: RNA, siren }));
            const expected = { rna: RNA, siren: SIREN };
            const actual = await rnaSirenService.getGroupedIdentifiers(SIREN);

            expect(actual).toEqual(expected);
        });

        it("should return just SIREN (Identifier is SIRET)", async () => {
            findBySirenMock.mockImplementationOnce(async siren => ({ siren }));
            const SIREN = "123456789";
            const SIRET = SIREN + "12345";
            const expected = { rna: undefined, siren: SIREN };
            const actual = await rnaSirenService.getGroupedIdentifiers(SIRET);

            expect(actual).toEqual(expected);
        });

        it("should return RNA and SIREN (Identifier is SIRET)", async () => {
            const RNA = "W123456789";
            const SIREN = "123456789";
            const SIRET = SIREN + "12345";
            findBySirenMock.mockImplementationOnce(async siren => ({ rna: RNA, siren }));
            const expected = { rna: RNA, siren: SIREN };
            const actual = await rnaSirenService.getGroupedIdentifiers(SIRET);

            expect(actual).toEqual(expected);
        });
    });
});
