import { WithId } from "mongodb";
import UserDto from "@api-subventions-asso/dto/user/UserDto";
import UserDbo from "../../modules/user/repositories/dbo/UserDbo";
import statsAssociationsVisitRepository from "../../modules/stats/repositories/statsAssociationsVisit.repository";
import { ONE_DAY_MS } from "./DateHelper";

export const isUserActif = async (user: WithId<UserDbo> | UserDbo | UserDto) => {
    const INACTIVE_THRESHOLD = 7 * ONE_DAY_MS;
    const lastSearchDate = await statsAssociationsVisitRepository.getLastSearchDate(user._id);
    if (!lastSearchDate) return false;

    return Date.now() - lastSearchDate.getTime() <= INACTIVE_THRESHOLD;
};
