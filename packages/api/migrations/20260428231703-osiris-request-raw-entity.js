const osirisRequestMapper = require("../build/src/adapters/inputs/cli/osiris/osiris-request.mapper").default;

const SOURCE_COLLECTION = "osiris-requests";
const BACKUP_COLLECTION = "old_osiris-requests";
const BATCH_SIZE = 500;

async function collectionExists(db, collectionName) {
    const collections = await db.listCollections({ name: collectionName }).toArray();
    return collections.length > 0;
}

function format(document) {
    const data = document.data;
    const exercise = document.providerInformations?.exercise;

    if (!data || !exercise) throw new Error(`Invalid document: missing data or exercise for _id ${document._id}`);

    const dto = osirisRequestMapper.toDto(data);
    const entity = osirisRequestMapper.toEntity(dto, exercise);

    return {
        _id: document._id,
        ...entity,
        updateDate: document.updateDate || new Date(),
    };
}

async function createIndexes(db) {
    const collection = db.collection(SOURCE_COLLECTION);
    await collection.createIndex({ "dossier.osirisId": 1, "dossier.exerciceBudgetaire": 1 }, { unique: true });
    await collection.createIndex({ "dossier.osirisId": 1 });
    await collection.createIndex({ "association.rna": 1 });
    await collection.createIndex({ "association.siret": 1 });
}

module.exports = {
    async up(db) {
        const sourceExists = await collectionExists(db, SOURCE_COLLECTION);
        const backupExists = await collectionExists(db, BACKUP_COLLECTION);

        if (sourceExists && backupExists) {
            throw new Error(
                `${SOURCE_COLLECTION} and ${BACKUP_COLLECTION} both exist. Refusing to run to avoid data loss. ` +
                    `Drop the partial ${SOURCE_COLLECTION} collection or rename ${BACKUP_COLLECTION} before retrying.`,
            );
        }

        if (!sourceExists && !backupExists) {
            console.log(`${SOURCE_COLLECTION} does not exist. Skip OSIRIS raw entity migration.`);
            return;
        }

        if (sourceExists) await db.renameCollection(SOURCE_COLLECTION, BACKUP_COLLECTION);

        const oldCollection = db.collection(BACKUP_COLLECTION);
        const newCollection = db.collection(SOURCE_COLLECTION);
        const cursor = oldCollection.find({});
        const operations = [];

        let processedCount = 0;

        for await (const document of cursor) {
            operations.push({
                replaceOne: {
                    filter: { _id: document._id },
                    replacement: format(document),
                    upsert: true,
                },
            });

            processedCount++;

            if (operations.length >= BATCH_SIZE) {
                await newCollection.bulkWrite(operations, { ordered: false });
                operations.length = 0;
            }
        }

        if (operations.length) await newCollection.bulkWrite(operations, { ordered: false });
        await createIndexes(db);
        console.log(`${processedCount} OSIRIS request documents migrated to raw entity format.`);
    },

    async down(db) {
        if (await collectionExists(db, SOURCE_COLLECTION)) await db.dropCollection(SOURCE_COLLECTION);
        if (await collectionExists(db, BACKUP_COLLECTION))
            await db.renameCollection(BACKUP_COLLECTION, SOURCE_COLLECTION);
    },
};
