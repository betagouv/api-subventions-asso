import db from "../../../../src/shared/MongoConnection";
import dataGouvService from "../../../../src/modules/providers/data_gouv/data_gouv.service";
import dataGouvRepository from "../../../../src/modules/providers/data_gouv/repositories/entreprise_siren.repository";
import { Collection } from "mongodb";
import EntrepriseSirenEntity from "../../../../src/modules/providers/data_gouv/entities/EntrepriseSirenEntity";

describe("DataGouvService",() => {
    describe("insertManyEntrepriseSiren", () => {
        let collection: Collection;
        let importCollection: Collection;

        const entities: EntrepriseSirenEntity[] = [];

        beforeEach(() => {
            collection = db.collection(dataGouvRepository.collectionName);
            importCollection = db.collection(dataGouvRepository.collectionImportName);

            entities.push(
                new EntrepriseSirenEntity("000000000"),
                new EntrepriseSirenEntity("000000001"),
                new EntrepriseSirenEntity("000000002"),
                new EntrepriseSirenEntity("000000003"),
            )
        });

        afterEach(() => {
            entities.length = 0;
        })

        it("should be insert many entities in collection", async () => {
            await dataGouvService.insertManyEntrepriseSiren(entities);

            await expect(collection.find().count()).resolves.toBe(entities.length);
            await expect(importCollection.find().count()).resolves.toBe(0);
        });

        it("should be insert many entities in imported collection", async () => {
            await dataGouvService.insertManyEntrepriseSiren(entities, true);

            await expect(importCollection.find().count()).resolves.toBe(entities.length);
            await expect(collection.find().count()).resolves.toBe(0);
        });
    });

    describe("switchEntrepriseSirenRepo", () => {
        const entities: EntrepriseSirenEntity[] = [];

        beforeEach(async () => {
            entities.push(
                new EntrepriseSirenEntity("000000000"),
                new EntrepriseSirenEntity("000000001"),
                new EntrepriseSirenEntity("000000002"),
                new EntrepriseSirenEntity("000000003"),
            )

            await dataGouvService.insertManyEntrepriseSiren(entities, true);
        });

        afterEach(() => {
            entities.length = 0;
        })

        it("should be create collection with insert collection data", async () => {
            await dataGouvService.switchEntrepriseSirenRepo();

            const collectionLength = await db.collection(dataGouvRepository.collectionName).find().count();

            expect(collectionLength).toBe(entities.length);
        });

        it("should be switch old collection with insert collection", async () => {
            await dataGouvService.insertManyEntrepriseSiren([
                new EntrepriseSirenEntity("000000099"),
            ]);

            await dataGouvService.switchEntrepriseSirenRepo();

            const collectionEntities = await db.collection(dataGouvRepository.collectionName).find().toArray();

            expect(collectionEntities).toHaveLength(entities.length)
            expect(collectionEntities.find(e => e._id.toString() == "000000099")).toBeFalsy();
        });
    });
})