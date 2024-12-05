import { AdminTerritorialLevel, AgentTypeEnum, type UserDto } from "dto";
import authService from "../auth/auth.service";
import userPort from "./user.port";

export class UsersService {
    SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;
    isUserActif(userDto: UserDto) {
        return Date.now() - new Date(userDto.lastActivityDate ?? 0).getTime() <= this.SEVEN_DAYS_MS;
    }

    async deleteCurrentUser() {
        await userPort.deleteSelfUser();
        await authService.logout(true);
    }

    getSelfUser() {
        return userPort.getSelfUser();
    }

    updateProfile(data) {
        return userPort.updateProfile(data);
    }

    isProfileFullyCompleted(user: UserDto) {
        // old users may not have agentType defined
        // TODO(maxime) : update UserDto to make it optionnal in code ??
        if (!user.agentType) return false;

        const sharedMandatoryFields = ["jobType", "service", "structure"];
        const mandatoryFieldsByAgentType = {
            [AgentTypeEnum.CENTRAL_ADMIN]: sharedMandatoryFields,
            [AgentTypeEnum.OPERATOR]: ["region"].concat(sharedMandatoryFields),
            [AgentTypeEnum.DECONCENTRATED_ADMIN]: ["region", "decentralizedLevel", "decentralizedTerritory"].concat(
                sharedMandatoryFields,
            ),
            [AgentTypeEnum.TERRITORIAL_COLLECTIVITY]: ["region", "territorialScope"].concat(sharedMandatoryFields),
        };

        const mandatoryFields = mandatoryFieldsByAgentType[user.agentType];

        if (user.agentType === AgentTypeEnum.DECONCENTRATED_ADMIN) {
            if (!user.decentralizedLevel) return false;
            const withRegion = [AdminTerritorialLevel.REGIONAL, AdminTerritorialLevel.DEPARTMENTAL].includes(
                user.decentralizedLevel,
            );

            // region is only mandatory for REGIONAL and DEPARTMENTAL levels
            if (!withRegion)
                return ![...mandatoryFields].filter(field => field !== "region").find(field => !user[field]);
        }
        return !mandatoryFields.find(field => !user[field]);
    }
}

const userService = new UsersService();

export default userService;
