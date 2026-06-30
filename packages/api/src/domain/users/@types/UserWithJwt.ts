import UserAuth from "./UserAuth";
import UserEntity from "../UserEntity";

export type UserWithJwt = Omit<UserEntity, "id"> & Omit<UserAuth, "hashPassword">;
