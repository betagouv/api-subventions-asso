import associationNameService from "./associationName.service";
import associationNameRepository from "./repositories/associationName.repository";
import { ObjectId } from "mongodb";

describe("associationName.service", () => {
    describe("getNameFromIdentifier()", () => {
        // @ts-expect-error mock private method
        const mergeEntitiesMock = jest.spyOn(associationNameService, "_mergeEntities");
        const repoMock = jest.spyOn(associationNameRepository, "findAllByIdentifier");
        const IDENTIFIER = "toto";
        const REPO_OUTPUT = [
            {
                _id: new ObjectId("62d6c89108d8d078053b48e1"),
                lastUpdate: new Date("2022-07-13T00:00:00.000Z"),
                name: "ALPCM NANTES BASKET",
                provider: "Base Sirene - DataGouv",
                rna: null,
                siren: "433955101"
            }
        ];

        beforeAll(() => {
            repoMock.mockResolvedValue(REPO_OUTPUT);
            // @ts-expect-error mock
            mergeEntitiesMock.mockImplementation(jest.fn());
        });
        afterAll(() => {
            repoMock.mockRestore();
            mergeEntitiesMock.mockRestore();
        });

        it("should call repo", async () => {
            await associationNameService.getNameFromIdentifier(IDENTIFIER);
            expect(repoMock).toBeCalledWith(IDENTIFIER);
        });

        it("should call most recent value from repo result", async () => {
            await associationNameService.getNameFromIdentifier(IDENTIFIER);
            expect(mergeEntitiesMock).toBeCalledWith(REPO_OUTPUT);
        });

        it("should return name most recent result", async () => {
            const expected = "nom d'asso";
            // @ts-expect-error mock
            mergeEntitiesMock.mockReturnValueOnce({ name: expected });
            const actual = await associationNameService.getNameFromIdentifier(IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("should not fail if no name in repo result", async () => {
            // @ts-expect-error mock
            mergeEntitiesMock.mockReturnValueOnce({});
            const actual = await associationNameService.getNameFromIdentifier(IDENTIFIER);
            expect(actual).toEqual(undefined);
        });
    });
    describe("getGroupedIdentifiers", () => {
        const findByRnaMock: jest.SpyInstance = jest.spyOn(associationNameRepository, "findByRna");
        const findBySirenMock: jest.SpyInstance = jest.spyOn(associationNameRepository, "findBySiren");

        it("should throw error", async () => {
            await expect(() => associationNameService.getGroupedIdentifiers("toto")).rejects.toThrowError(
                "identifier type is not supported"
            );
        });

        it("should return just RNA", async () => {
            findByRnaMock.mockImplementationOnce(async rna => [{ rna }]);
            const RNA = "W123456789";
            const expected = { rna: RNA, siren: undefined };
            const actual = await associationNameService.getGroupedIdentifiers(RNA);

            expect(actual).toEqual(expected);
        });

        it("should return RNA and SIREN (Identifier is RNA)", async () => {
            const RNA = "W123456789";
            const SIREN = "123456789";
            findByRnaMock.mockImplementationOnce(async rna => [{ rna }, { rna, siren: SIREN }]);
            const expected = { rna: RNA, siren: SIREN };
            const actual = await associationNameService.getGroupedIdentifiers(RNA);

            expect(actual).toEqual(expected);
        });

        it("should return just SIREN", async () => {
            findBySirenMock.mockImplementationOnce(async siren => [{ siren }]);
            const SIREN = "123456789";
            const expected = { rna: undefined, siren: SIREN };
            const actual = await associationNameService.getGroupedIdentifiers(SIREN);

            expect(actual).toEqual(expected);
        });

        it("should return RNA and SIREN (Identifier is SIREN)", async () => {
            const RNA = "W123456789";
            const SIREN = "123456789";
            findBySirenMock.mockImplementationOnce(async siren => [{ siren }, { rna: RNA, siren }]);
            const expected = { rna: RNA, siren: SIREN };
            const actual = await associationNameService.getGroupedIdentifiers(SIREN);

            expect(actual).toEqual(expected);
        });

        it("should return just SIREN (Identifier is SIRET)", async () => {
            findBySirenMock.mockImplementationOnce(async siren => [{ siren }]);
            const SIREN = "123456789";
            const SIRET = SIREN + "12345";
            const expected = { rna: undefined, siren: SIREN };
            const actual = await associationNameService.getGroupedIdentifiers(SIRET);

            expect(actual).toEqual(expected);
        });

        it("should return RNA and SIREN (Identifier is SIRET)", async () => {
            const RNA = "W123456789";
            const SIREN = "123456789";
            const SIRET = SIREN + "12345";
            findBySirenMock.mockImplementationOnce(async siren => [{ rna: RNA, siren }]);
            const expected = { rna: RNA, siren: SIREN };
            const actual = await associationNameService.getGroupedIdentifiers(SIRET);

            expect(actual).toEqual(expected);
        });
    });
});
