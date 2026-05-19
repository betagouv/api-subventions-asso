const osirisActionMapper = require("../build/src/adapters/inputs/cli/osiris/osiris-action.mapper").default;

const SOURCE_COLLECTION = "osiris-actions";
const BACKUP_COLLECTION = "old_osiris-actions";
const BATCH_SIZE = 500;

async function collectionExists(db, collectionName) {
    const collections = await db.listCollections({ name: collectionName }).toArray();
    return collections.length > 0;
}

function extractExercise(document) {
    const fromIndexed = document.indexedInformations?.exercise;
    if (fromIndexed) return fromIndexed;
    const dossier = document.data?.["Dossier/action"] || document.data?.["Dossier"];
    return dossier?.["Exercice Budgetaire"] || dossier?.["Exercice budgetaire"];
}

function format(document) {
    const data = document.data;
    const exercise = extractExercise(document);

    if (!data || !exercise) throw new Error(`Invalid document: missing data or exercise for _id ${document._id}`);

    const dto = osirisActionMapper.toDto(data);
    const entity = osirisActionMapper.toEntity(dto, exercise);

    return {
        _id: document._id,
        ...entity,
        updateDate: document.updateDate || new Date(),
    };
}

async function createIndexes(db) {
    const collection = db.collection(SOURCE_COLLECTION);
    await collection.createIndex({ "dossier.uniqueId": 1 }, { unique: true });
    await collection.createIndex({ "dossier.osirisActionId": 1 });
    await collection.createIndex({ "dossier.requestUniqueId": 1 });
    await collection.createIndex({ "dossier.compteAssoId": 1 });
    await collection.createIndex({ "beneficiaire.siret": 1 });
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
            console.log(`${SOURCE_COLLECTION} does not exist. Skip OSIRIS action raw entity migration.`);
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
        console.log(`${processedCount} OSIRIS action documents migrated to raw entity format.`);
    },
};
