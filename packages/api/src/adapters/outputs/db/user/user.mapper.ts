import { ObjectId, WithId } from "mongodb";
import NewUserEntity from "../../../../domain/users/NewUserEntity";
import UserEntity from "../../../../domain/users/UserEntity";
import { UserDbo } from "./user.dbo";

export default class UserMapper {
    static toDbo(user: UserEntity | NewUserEntity) {
        if (user.id) {
            const { id, ...partialUser } = user;
            return { ...partialUser, _id: new ObjectId(id) };
        } else return user;
    }

    static toEntity(user: WithId<UserDbo>) {
        const { _id, ...partialUser } = user;
        return new UserEntity({ ...partialUser, id: _id.toString() });
    }
}
