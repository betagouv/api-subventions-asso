// best practice to not use enum and this is the new way
export const FileStatus = { NOT_IMPORTED: "not-imported", IMPORTED: "imported" } as const;
export type FileStatus = (typeof FileStatus)[keyof typeof FileStatus];
