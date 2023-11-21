import UniteLegalNameEntity from "../../entities/UniteLegalNameEntity";
import uniteLegalNamesService from "../providers/uniteLegalNames/uniteLegalNames.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import associationNameService from "./associationName.service";
import AssociationNameEntity from "./entities/AssociationNameEntity";
import { ObjectId } from "mongodb";

describe("associationName.service", () => {
    describe("getNameFromIdentifier()", () => {
        const uniteLegalNameMock = jest.spyOn(uniteLegalNamesService, "getNameFromIdentifier");
        const IDENTIFIER = "toto";
        const REPO_OUTPUT = new UniteLegalNameEntity(
            "433955101",
            "ALPCM NANTES BASKET",
            "",
            new Date("2022-07-13T00:00:00.000Z"),
        );

        beforeAll(() => {
            uniteLegalNameMock.mockResolvedValue(REPO_OUTPUT);
        });
        afterAll(() => {
            uniteLegalNameMock.mockRestore();
        });

        it("should call repo", async () => {
            await associationNameService.getNameFromIdentifier(IDENTIFIER);
            expect(uniteLegalNameMock).toBeCalledWith(IDENTIFIER);
        });
    });
    describe("getAllByValye", () => {
        it("return an array AssociationNameEntity", async () => {
            const INPUT = "";
            const associationNameEntity = new UniteLegalNameEntity("W75000000", "0000000000", "FAKE NAME", new Date());
            jest.spyOn(uniteLegalNamesService, "findBy").mockResolvedValue([associationNameEntity]);
            jest.spyOn(rnaSirenService, "find").mockResolvedValue(null);
            const expected = [new AssociationNameEntity(associationNameEntity.name, associationNameEntity.siren)];
            const actual = await associationNameService.getAllByValye(INPUT);
            expect(actual).toEqual(expected);
        });
    });
});
