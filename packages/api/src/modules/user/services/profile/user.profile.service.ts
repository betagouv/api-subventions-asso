import dedent from "dedent";
import {
    AdminTerritorialLevel,
    AgentJobTypeEnum,
    AgentTypeEnum,
    ResetPasswordErrorCodes,
    TerritorialScopeEnum,
    UpdatableUser,
    UserActivationInfoDto,
    UserDto,
} from "dto";
import { isInObjectValues } from "../../../../shared/Validators";
import { BadRequestError, UserNotFoundError } from "../../../../shared/errors/httpErrors";
import { joinEnum } from "../../../../shared/helpers/ArrayHelper";
import userCheckService, { UserCheckService } from "../check/user.check.service";
import { sanitizeToPlainText } from "../../../../shared/helpers/StringHelper";
import userRepository from "../../repositories/user.repository";
import { removeSecrets } from "../../../../shared/helpers/RepositoryHelper";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userResetRepository from "../../repositories/user-reset.repository";
import UserReset from "../../entities/UserReset";
import userAuthService from "../auth/user.auth.service";
import UserDbo from "../../repositories/dbo/UserDbo";
import userActivationService from "../activation/user.activation.service";
import userCrudService from "../crud/user.crud.service";

export class UserProfileService {
    validateUserProfileData(userInfo, withPassword = true): { valid: false; error: Error } | { valid: true } {
        const { password, agentType, jobType, structure } = userInfo;
        const validations = [
            {
                value: agentType,
                method: value => isInObjectValues(AgentTypeEnum, value),
                error: new BadRequestError(dedent`Mauvaise valeur pour le type d'agent.
                    Les valeurs possibles sont ${joinEnum(AgentTypeEnum)}
                `),
            },
            {
                value: jobType,
                method: jobType => {
                    if (!jobType?.length) return true;
                    return !jobType.find(type => !isInObjectValues(AgentJobTypeEnum, type));
                },
                error: new BadRequestError(dedent`Mauvaise valeur pour le type de poste.
                    Les valeurs possibles sont ${joinEnum(AgentJobTypeEnum)}
                `),
            },
            {
                value: structure,
                method: value => !value || typeof value == "string",
                error: new BadRequestError(dedent`Mauvaise valeur pour la structure.`),
            },
        ];

        if (withPassword)
            validations.push({
                value: password,
                method: userCheckService.passwordValidator,
                error: new BadRequestError(
                    UserCheckService.PASSWORD_VALIDATOR_MESSAGE,
                    ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID,
                ),
            });

        /**
         *          AGENT TYPE SPECIFIC VALUES
         */

        if (agentType === AgentTypeEnum.TERRITORIAL_COLLECTIVITY)
            validations.push({
                value: userInfo.territorialScope,
                method: value => !value || isInObjectValues(TerritorialScopeEnum, value),
                error: new BadRequestError(dedent`Mauvaise valeur pour le périmètre
                Les valeurs possibles sont ${joinEnum(TerritorialScopeEnum)}`),
            });

        if (agentType === AgentTypeEnum.DECONCENTRATED_ADMIN)
            validations.push({
                value: userInfo.decentralizedLevel,
                method: value => !value || isInObjectValues(AdminTerritorialLevel, value),
                error: new BadRequestError(dedent`Mauvaise valeur pour le niveau territorial
                Les valeurs possibles sont ${joinEnum(AdminTerritorialLevel)}`),
            });

        let error: Error | undefined;
        for (const validation of validations) {
            if (!validation.method(validation.value)) {
                error = validation.error;
                break;
            }
        }
        return error ? { valid: false, error: error as BadRequestError } : { valid: true };
    }

    sanitizeUserProfileData(unsafeUserInfo) {
        const fieldsToSanitize = ["service", "phoneNumber", "structure", "decentralizedTerritory, firstName, lastName"];
        const sanitizedUserInfo = { ...unsafeUserInfo };
        fieldsToSanitize.forEach(field => {
            if (field in unsafeUserInfo) sanitizedUserInfo[field] = sanitizeToPlainText(unsafeUserInfo[field]);
        });
        return sanitizedUserInfo;
    }

    async profileUpdate(user: UserDto, data: Partial<UpdatableUser>): Promise<UserDto> {
        if (!user) throw new UserNotFoundError();

        const toBeUpdatedUser = { ...user, ...data };

        const userInfoValidation = userProfileService.validateUserProfileData(toBeUpdatedUser, false);
        if (!userInfoValidation.valid) throw userInfoValidation.error;

        const safeUserInfo = userProfileService.sanitizeUserProfileData(data);
        const updatedUser = await userRepository.update({ ...user, ...safeUserInfo });

        const safeUpdatedUser = removeSecrets(updatedUser);
        notifyService.notify(NotificationType.USER_UPDATED, safeUpdatedUser);
        return safeUpdatedUser;
    }

    public async activate(resetToken: string, userInfo: UserActivationInfoDto): Promise<UserDto> {
        const userReset = await userResetRepository.findByToken(resetToken);

        const tokenValidation = userActivationService.validateResetToken(userReset);
        if (!tokenValidation.valid) throw tokenValidation.error;

        const user = await userCrudService.getUserById((userReset as UserReset).userId);
        if (!user) throw new UserNotFoundError();

        if (!userInfo.jobType) userInfo.jobType = [];

        const userInfoValidation = userProfileService.validateUserProfileData(userInfo);
        if (!userInfoValidation.valid) throw userInfoValidation.error;

        const safeUserInfo = userProfileService.sanitizeUserProfileData(userInfo);
        safeUserInfo.hashPassword = await userAuthService.getHashPassword(safeUserInfo.password);
        delete safeUserInfo.password;
        const activeUser = (await userRepository.update(
            {
                ...user,
                ...safeUserInfo,
                active: true,
                profileToComplete: false,
                lastActivityDate: new Date(),
            },
            true,
        )) as Omit<UserDbo, "hashPassword">;

        const userWithJwt = await userAuthService.updateJwt(activeUser);

        notifyService.notify(NotificationType.USER_UPDATED, userWithJwt);

        return userWithJwt;
    }
}

const userProfileService = new UserProfileService();
export default userProfileService;
