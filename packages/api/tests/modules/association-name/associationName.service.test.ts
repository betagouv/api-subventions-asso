import associationNameService from '../../../src/modules/association-name/associationName.service';
import AssociationNameEntity from '../../../src/modules/association-name/entities/AssociationNameEntity';
import associationNameRepository from '../../../src/modules/association-name/repositories/associationName.repository';

describe("AssociationNameService", () => {
    describe("getAllStartingWith", () => {
        it("return an array AssociationNameEntity", async () => {
            const INPUT = "";
            const LAST_UPDATE = new Date();
            jest.spyOn(associationNameRepository, "findAllStartingWith").mockImplementation(jest.fn().mockResolvedValue([{_id: "", rna: "", siren: "", name: "", provider: "", lastUpdate: LAST_UPDATE}]));
            const expected = [new AssociationNameEntity("","","","", LAST_UPDATE)];
            const actual = await associationNameService.getAllStartingWith(INPUT);
            expect(actual).toEqual(expected)
        })
    })
})