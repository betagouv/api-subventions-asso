import { AnonymizedUser } from "../../../../domain/users/@types/AnonymizedUser";
import NewUserEntity from "../../../../domain/users/NewUserEntity";
import UserEntity from "../../../../domain/users/UserEntity";

export type UserDbo = UserEntity | NewUserEntity | AnonymizedUser;
