import { WithId } from "mongodb";
import { UserDto } from "dto";
import UserDbo from "../../dataProviders/db/user/UserDbo";
import statsService from "../../modules/stats/stats.service";
import { ONE_DAY_MS } from "./DateHelper";

export const isUserActif = async (user: WithId<UserDbo> | UserDbo | UserDto) => {
    const INACTIVE_THRESHOLD = 7 * ONE_DAY_MS;
    const lastSearchDate = await statsService.getUserLastSearchDate(user._id);
    if (!lastSearchDate) return false;

    return Date.now() - lastSearchDate.getTime() <= INACTIVE_THRESHOLD;
};
