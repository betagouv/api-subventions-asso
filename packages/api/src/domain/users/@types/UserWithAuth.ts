import UserAuth from "./UserAuth";
import UserEntity from "../UserEntity";

type UserWithAuth = Omit<UserEntity, "id"> & UserAuth;
export default UserWithAuth;
