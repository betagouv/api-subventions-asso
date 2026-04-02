export type BulkUpsertResult = {
    insertedCount: number;
    upsertedCount: number;
    modifiedCount: number;
    matchedCount: number;
};
