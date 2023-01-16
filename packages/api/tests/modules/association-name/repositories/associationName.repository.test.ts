import { MongoServerError } from "mongodb";
import db from "../../../../src/shared/MongoConnection";
import AssociationNameEntity from "../../../../src/modules/association-name/entities/AssociationNameEntity";
import associationNameRepository from "../../../../src/modules/association-name/repositories/associationName.repository";

const AssociationNameArray = [
    {
        rna: "W000000000",
        siren: "010000000",
        name: "Equitation Club",
        provider: "",
        lastUpdate: new Date()
    },
    {
        rna: "W000000001",
        siren: "007000001",
        name: "Equité pour tous",
        provider: "",
        lastUpdate: new Date()
    },
    {
        rna: "W000000002",
        siren: "010000002",
        name: "Club sandwitch",
        provider: "",
        lastUpdate: new Date()
    },
    {
        rna: "W000000003",
        siren: "00000003",
        name: "007 Fan Collection",
        provider: "",
        lastUpdate: new Date()
    }
];

const AssociationEntityArray = AssociationNameArray.map(
    item => new AssociationNameEntity(item.rna, item.name, item.provider, item.lastUpdate, item.siren)
);

describe("AssociationNameRepository", () => {
    beforeEach(async () => {
        // TODO: try to import this from the migration script...
        await db.collection("association-name").createIndex({ siren: 1, rna: 1, name: 1 }, { unique: true });
        await Promise.all(AssociationEntityArray.map(async entity => await associationNameRepository.create(entity)));
    });
    it("cannot store duplicates", async () => {
        let actual;
        try {
            await associationNameRepository.create(AssociationEntityArray[0]);
        } catch (e) {
            actual = e as Error;
        }
        expect(actual).toBeInstanceOf(MongoServerError);
        expect(actual?.message).toContain("E11000");
    });

    describe("findAllStartingWith", () => {
        it("should return entities", async () => {
            const INPUT = "007";
            const expected = [AssociationEntityArray[1], AssociationEntityArray[3]];
            const actual = await associationNameRepository.findAllStartingWith(INPUT);
            expect(actual).toEqual(expected);
        });
    });
});
