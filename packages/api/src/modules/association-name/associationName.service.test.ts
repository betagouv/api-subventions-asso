import associationNameService from "./associationName.service";
import AssociationNameEntity from "./entities/AssociationNameEntity";
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
                siren: "433955101",
            },
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
    describe("getAllStartingWith", () => {
        it("return an array AssociationNameEntity", async () => {
            const INPUT = "";
            const LAST_UPDATE = new Date();
            const associationNameEntity = new AssociationNameEntity(
                "W75000000",
                "0000000000",
                "FAKE NAME",
                LAST_UPDATE,
                null,
            );
            jest.spyOn(associationNameRepository, "findAllStartingWith").mockResolvedValue([associationNameEntity]);
            const expected = [associationNameEntity];
            const actual = await associationNameService.getAllStartingWith(INPUT);
            expect(actual).toEqual(expected);
        });
    });
});
