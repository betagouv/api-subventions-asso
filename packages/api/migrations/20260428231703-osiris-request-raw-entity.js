const SOURCE_COLLECTION = "osiris-requests";
const BACKUP_COLLECTION = "old_osiris-requests";
const BATCH_SIZE = 500;

const CATEGORY_TRANSLATIONS = new Map([["Dossier/action", "Dossier"]]);

const CATEGORY_RENAMINGS = new Map([["coordonneesCorrespondancePublipostage", "coordonnees"]]);

const FIELD_RENAMINGS = new Map([
    ["noRna", "rna"],
    ["noEj", "ej"],
    ["noSiret", "siret"],
    ["noDossierOsiris", "osirisId"],
    ["noDossierCompteAsso", "compteAssoId"],
    ["iBAN", "iban"],
    ["bIC", "bic"],
]);

const HEADER_TRANSLATIONS = new Map([
    ["N°", "no"],
    ["Numero", "numero"],
    ["Réalisé", "realise"],
    ["Bénéficiaire", "beneficiaire"],
    ["Représentant légal", "representantLegal"],
    ["Coordonnées correspondance (publipostage)", "coordonneesCorrespondancePublipostage"],
]);

const DEPRECATED_FIELDS = new Set([
    "legalInformations",
    "provider",
    "providerInformations",
    "indexedInformations",
    "data",
]);

function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date);
}

function toCamelCase(value, translations) {
    const translated = translations.get(value);

    if (translated) return translated;

    const normalized = `${value}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, " et ")
        .replace(/°/g, "o")
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .trim();

    const words = normalized.split(/\s+/).filter(Boolean);

    if (!words.length) return "";

    return words
        .map((word, index) => {
            const lower = word.toLowerCase();

            if (index === 0) return lower;

            return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("");
}

function getCategoryKey(category) {
    const normalizedCategory = CATEGORY_TRANSLATIONS.get(category) || category;
    const rawCategoryKey = toCamelCase(normalizedCategory, HEADER_TRANSLATIONS);

    return CATEGORY_RENAMINGS.get(rawCategoryKey) || rawCategoryKey;
}

function getFieldKey(header) {
    const rawFieldKey = toCamelCase(header, HEADER_TRANSLATIONS);

    return FIELD_RENAMINGS.get(rawFieldKey) || rawFieldKey;
}

function legacyDataToRawEntity(data) {
    if (!isPlainObject(data)) return {};

    return Object.entries(data).reduce((entity, [category, values]) => {
        if (!isPlainObject(values)) return entity;

        const categoryKey = getCategoryKey(category);

        if (!categoryKey) return entity;

        const mappedValues = Object.entries(values).reduce((acc, [header, value]) => {
            const fieldKey = getFieldKey(header);

            if (!fieldKey) return acc;

            acc[fieldKey] = value;

            return acc;
        }, {});

        entity[categoryKey] = {
            ...(entity[categoryKey] || {}),
            ...mappedValues,
        };

        return entity;
    }, {});
}

function existingRawEntity(document) {
    return Object.entries(document).reduce((entity, [key, value]) => {
        if (key === "_id" || DEPRECATED_FIELDS.has(key)) return entity;

        entity[key] = value;

        return entity;
    }, {});
}

function setIfMissing(target, key, value) {
    if (target[key] !== undefined && target[key] !== null && target[key] !== "") return;
    if (value === undefined || value === null || value === "") return;

    target[key] = value;
}

function completeEntityWithLegacyFallbacks(entity, document) {
    const legalInformations = document.legalInformations || {};
    const providerInformations = document.providerInformations || {};

    entity.dossier = entity.dossier || {};

    setIfMissing(entity.dossier, "osirisId", providerInformations.osirisId);
    setIfMissing(entity.dossier, "compteAssoId", providerInformations.compteAssoId);
    setIfMissing(entity.dossier, "ej", providerInformations.ej);
    setIfMissing(entity.dossier, "exerciceBudgetaire", providerInformations.exercise);

    const identityCategoryName = entity.association ? "association" : "beneficiaire";
    entity[identityCategoryName] = entity[identityCategoryName] || {};

    setIfMissing(entity[identityCategoryName], "siret", legalInformations.siret || providerInformations.siret);
    setIfMissing(entity[identityCategoryName], "rna", legalInformations.rna || providerInformations.rna);
    setIfMissing(entity[identityCategoryName], "nom", legalInformations.name);

    return entity;
}

function toRawEntity(document) {
    const rawFromData = legacyDataToRawEntity(document.data);
    const rawFromDocument = Object.keys(rawFromData).length ? {} : existingRawEntity(document);
    const entity = completeEntityWithLegacyFallbacks({ ...rawFromDocument, ...rawFromData }, document);

    return {
        _id: document._id,
        ...entity,
        updateDate: document.updateDate || new Date(),
    };
}

async function collectionExists(db, collectionName) {
    const collections = await db.listCollections({ name: collectionName }).toArray();

    return collections.length > 0;
}

async function createIndexes(db) {
    const collection = db.collection(SOURCE_COLLECTION);

    await collection.createIndex({ "dossier.osirisId": 1, "dossier.exerciceBudgetaire": 1 }, { unique: true });
    await collection.createIndex({ "dossier.osirisId": 1 });
    await collection.createIndex({ "association.rna": 1 });
    await collection.createIndex({ "beneficiaire.rna": 1 });
    await collection.createIndex({ "association.siret": 1 });
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
            console.log(`${SOURCE_COLLECTION} does not exist. Skip OSIRIS raw entity migration.`);
            return;
        }

        if (sourceExists) {
            await db.renameCollection(SOURCE_COLLECTION, BACKUP_COLLECTION);
        }

        const oldCollection = db.collection(BACKUP_COLLECTION);
        const newCollection = db.collection(SOURCE_COLLECTION);
        const cursor = oldCollection.find({});
        const operations = [];
        let processedCount = 0;

        for await (const document of cursor) {
            operations.push({
                replaceOne: {
                    filter: { _id: document._id },
                    replacement: toRawEntity(document),
                    upsert: true,
                },
            });

            processedCount++;

            if (operations.length >= BATCH_SIZE) {
                await newCollection.bulkWrite(operations, { ordered: false });
                operations.length = 0;
            }
        }

        if (operations.length) {
            await newCollection.bulkWrite(operations, { ordered: false });
        }

        await createIndexes(db);

        console.log(`${processedCount} OSIRIS request documents migrated to raw entity format.`);
    },

    async down(db) {
        const sourceExists = await collectionExists(db, SOURCE_COLLECTION);
        const backupExists = await collectionExists(db, BACKUP_COLLECTION);

        if (sourceExists) {
            await db.dropCollection(SOURCE_COLLECTION);
        }

        if (backupExists) {
            await db.renameCollection(BACKUP_COLLECTION, SOURCE_COLLECTION);
        }
    },
};
