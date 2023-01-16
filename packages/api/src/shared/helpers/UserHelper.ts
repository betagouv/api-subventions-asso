import { WithId } from "mongodb";
import UserDto from "@api-subventions-asso/dto/user/UserDto";
import UserDbo from "../../modules/user/repositories/dbo/UserDbo";
import { ONE_DAY_MS } from "./DateHelper";

export const isUserActif = (user: WithId<UserDbo> | UserDbo | UserDto) => {
    const INACTIVE_THRESHOLD = 7 * ONE_DAY_MS;
    if (!user?.stats?.lastSearchDate) return false;
    return Date.now() - user.stats.lastSearchDate.getTime() <= INACTIVE_THRESHOLD;
};
