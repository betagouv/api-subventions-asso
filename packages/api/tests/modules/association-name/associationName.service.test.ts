import associationNameService from '../../../src/modules/association-name/associationName.service';
import AssociationNameEntity from '../../../src/modules/association-name/entities/AssociationNameEntity';
import associationNameRepository from '../../../src/modules/association-name/repositories/associationName.repository';

describe("AssociationNameService", () => {
    describe("getAllStartingWith", () => {
        it("return an array AssociationNameEntity", async () => {
            const INPUT = "";
            const LAST_UPDATE = new Date();
            const associationNameEntity = new AssociationNameEntity("W75000000", "0000000000", "FAKE NAME", LAST_UPDATE, "")
            jest.spyOn(associationNameRepository, "findAllStartingWith").mockImplementation(jest.fn().mockResolvedValue([associationNameEntity]));
            const expected = [associationNameEntity];
            const actual = await associationNameService.getAllStartingWith(INPUT);
            expect(actual).toEqual(expected)
        })
    })
})