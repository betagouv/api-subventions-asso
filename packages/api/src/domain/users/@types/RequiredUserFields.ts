import UserEntity from "../UserEntity";
import UserEmail from "./UserEmail";

type RequiredUserFields = UserEmail &
    Required<
        Pick<UserEntity, "id" | "roles" | "active" | "profileToComplete" | "nbVisits" | "signupAt" | "lastActivityDate">
    >;
export default RequiredUserFields;
