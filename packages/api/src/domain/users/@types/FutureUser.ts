import UserEntity from "../UserEntity";
import UserEmail from "./UserEmail";
import { UserRoles } from "./UserRoles";

export type FutureUser = UserEmail & { roles?: UserRoles[] } & Pick<
        UserEntity,
        "firstName" | "lastName" | "proConnectId"
    >;
