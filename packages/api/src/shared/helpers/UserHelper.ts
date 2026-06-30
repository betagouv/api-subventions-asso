import statsService from "../../modules/stats/stats.service";
import { ONE_DAY_MS } from "./DateHelper";
import { RoleEnum } from "../../domain/users/@types/UserRoles";
import UserEntity from "../../domain/users/UserEntity";

export const isUserActif = async (user: UserEntity) => {
    const INACTIVE_THRESHOLD = 7 * ONE_DAY_MS;
    const lastSearchDate = await statsService.getUserLastSearchDate(user.id);
    if (!lastSearchDate) return false;

    return Date.now() - lastSearchDate.getTime() <= INACTIVE_THRESHOLD;
};

export const isUserAdmin = (user: UserEntity) => user.roles.includes(RoleEnum.admin);
