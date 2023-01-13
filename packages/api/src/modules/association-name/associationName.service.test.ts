import associationNameService from "./associationName.service";
import associationNameRepository from "./repositories/associationName.repository";
import { ObjectId } from "mongodb";
import { resolveObjectURL } from "buffer";

describe("associationName.service", () => {
    describe("getNameFromIdentifier()", () => {
        // @ts-expect-error mock private method
        const mostRecentMock = jest.spyOn(associationNameService, "_getMostRecentEntity");
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
            mostRecentMock.mockImplementation(jest.fn());
        });
        afterAll(() => {
            repoMock.mockRestore();
            mostRecentMock.mockRestore();
        });

        it("should call repo", async () => {
            await associationNameService.getNameFromIdentifier(IDENTIFIER);
            expect(repoMock).toBeCalledWith(IDENTIFIER);
        });

        it("should call most recent value from repo result", async () => {
            await associationNameService.getNameFromIdentifier(IDENTIFIER);
            expect(mostRecentMock).toBeCalledWith(REPO_OUTPUT);
        });

        it("should return name most recent result", async () => {
            const expected = "nom d'asso";
            // @ts-expect-error mock
            mostRecentMock.mockReturnValueOnce({ name: expected });
            const actual = await associationNameService.getNameFromIdentifier(IDENTIFIER);
            expect(actual).toEqual(expected);
        });

        it("should not fail if no name in repo result", async () => {
            // @ts-expect-error mock
            mostRecentMock.mockReturnValueOnce({});
            const actual = await associationNameService.getNameFromIdentifier(IDENTIFIER);
            expect(actual).toEqual(undefined);
        });
    });
});
