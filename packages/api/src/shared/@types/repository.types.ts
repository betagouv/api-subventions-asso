export type InsertResult<TId = string> = {
    acknowledged: boolean;
    insertedId: TId;
};
