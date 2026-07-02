import UserEntity from "../UserEntity";

export type AnonymizedUser = Omit<UserEntity, "id"> & { jwt?: null; hashPassword?: null };
