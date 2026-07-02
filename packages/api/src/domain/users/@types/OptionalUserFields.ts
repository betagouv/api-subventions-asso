import UserEntity from "../UserEntity";
import RequiredUserProps from "./RequiredUserFields";

type OptionalUserProps = Partial<Omit<UserEntity, keyof RequiredUserProps>>;
export default OptionalUserProps;
