import UserEntity from "../UserEntity";

type UserEmail = Required<Pick<UserEntity, "email">>;
export default UserEmail;
