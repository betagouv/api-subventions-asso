import dedent from "dedent";
import {
    AdminTerritorialLevel,
    AgentJobTypeEnum,
    AgentTypeEnum,
    RegistrationSrcTypeEnum,
    TerritorialScopeEnum,
    UserActivationInfoDto,
} from "dto";
import { BadRequestError, ResetTokenNotFoundError, UserNotFoundError } from "core";
import { isInObjectValues } from "../../../../shared/Validators";
import { joinEnum } from "../../../../shared/helpers/ArrayHelper";
import userCheckService, { UserCheckService } from "../check/user.check.service";
import { sanitizeToPlainText } from "../../../../shared/helpers/StringHelper";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userResetAdapter from "../../../../adapters/outputs/db/user/user-reset.adapter";
import userAuthService from "../auth/user.auth.service";
import userActivationService from "../activation/user.activation.service";
import userCrudService from "../crud/user.crud.service";
import geoService from "../../../providers/geo-api/geo.service";
import { applyValidations, ValidationCriterias, ValidationResult } from "../../../../shared/helpers/validation.helper";
import userProConnectService from "../pro-connect/user.pro-connect.service";
import UserEntity from "../../../../domain/users/UserEntity";
import UpdatableUserFields from "../../../../domain/users/@types/UpdatableUserFields";

export class UserProfileService {
    validateUserProfileData(userInfo: Partial<UserEntity> & { password?: string }): ValidationResult {
        const { agentType, jobType, structure, region, registrationSrc } = userInfo;
        let password = "";
        if (userInfo.password) password = userInfo?.password;
        const validations: ValidationCriterias = [
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
                    // @ts-expect-error: show since typescript update #3360
                    if (!jobType?.length) return true;
                    // @ts-expect-error: show since typescript update #3360
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
            {
                value: region,
                // TODO: verify from GEO API
                method: value => !value || typeof value == "string",
                error: new BadRequestError(dedent`Mauvaise valeur pour la région.`),
            },
            {
                value: registrationSrc,
                method: registrationSrc => {
                    // @ts-expect-error: show since typescript update #3360
                    if (!registrationSrc?.length) return true;
                    // @ts-expect-error: show since typescript update #3360
                    return !registrationSrc.find(value => !isInObjectValues(RegistrationSrcTypeEnum, value));
                },
                error: new BadRequestError(dedent`Mauvaise valeur pour la provenance.
                    Les valeurs possibles sont ${joinEnum(RegistrationSrcTypeEnum)}
                `),
            },
        ];

        if (userInfo.password)
            validations.push({
                value: password,
                // @ts-expect-error: show since typescript update #3360
                method: userCheckService.passwordValidator,
                error: new BadRequestError(UserCheckService.PASSWORD_VALIDATOR_MESSAGE),
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

        return applyValidations(validations);
    }

    sanitizeUserProfileData(unsafeUserInfo: Partial<UpdatableUserFields> | UserActivationInfoDto) {
        const fieldsToSanitize = [
            "service",
            "phoneNumber",
            "structure",
            "decentralizedTerritory, firstName, lastName",
            "region",
            "registrationSrcDetails",
        ];
        const sanitizedUserInfo = { ...unsafeUserInfo };
        fieldsToSanitize.forEach(field => {
            if (field in unsafeUserInfo) sanitizedUserInfo[field] = sanitizeToPlainText(unsafeUserInfo[field]);
        });
        return sanitizedUserInfo;
    }

    async profileUpdate(user: UserEntity, data: Partial<UpdatableUserFields>) {
        if (!user) throw new UserNotFoundError();

        const toBeUpdatedUser = new UserEntity({ ...user, ...data });

        const userInfoValidation = userProfileService.validateUserProfileData(toBeUpdatedUser);
        if (!userInfoValidation.valid) throw userInfoValidation.error;

        const validationProConnect = userProConnectService.proConnectUpdateValidations(user, data);
        if (!validationProConnect.valid) throw validationProConnect.error;

        const safeUserInfo = userProfileService.sanitizeUserProfileData(data);
        await this.deduceRegion(safeUserInfo);
        const updatedUser = await userAdapter.update(new UserEntity({ ...user, ...safeUserInfo }));

        notifyService.notify(NotificationType.USER_UPDATED, updatedUser);
        return updatedUser;
    }

    public async activate(resetToken: string, userInfo: UserActivationInfoDto) {
        // @TODO remove if/when unused by consumers
        const userReset = await userResetAdapter.findByToken(resetToken);
        if (!userReset) throw new ResetTokenNotFoundError();

        const tokenValidation = userActivationService.validateResetToken(userReset);
        if (!tokenValidation.valid) throw tokenValidation.error;

        const user = await userCrudService.getUserById(userReset.userId);
        if (!user) throw new UserNotFoundError();

        if (!userInfo.jobType) userInfo.jobType = [];
        if (!userInfo.registrationSrc) userInfo.registrationSrc = [];

        const userInfoValidation = userProfileService.validateUserProfileData(userInfo);
        if (!userInfoValidation.valid) throw userInfoValidation.error;

        const safeUserInfo = userProfileService.sanitizeUserProfileData(userInfo) as UserActivationInfoDto & {
            hashPassword: string;
        };
        await this.deduceRegion(safeUserInfo);

        safeUserInfo.hashPassword = await userAuthService.getHashPassword(safeUserInfo.password);
        // @ts-expect-error -- intermediate type
        delete safeUserInfo.password;

        const activeUser = await userAdapter.update(
            new UserEntity({
                ...user,
                ...safeUserInfo,
                active: true,
                profileToComplete: false,
                lastActivityDate: new Date(),
            }),
            true,
        );

        const userWithJwt = await userAuthService.updateJwt(activeUser);

        notifyService.notify(NotificationType.USER_UPDATED, activeUser);
        notifyService.notify(NotificationType.USER_ACTIVATED, { email: user.email });
        notifyService.notify(NotificationType.USER_LOGGED, {
            email: user.email,
            date: new Date(),
        });

        return userWithJwt;
    }

    private async deduceRegion(userInfo: Partial<UpdatableUserFields> | UserActivationInfoDto) {
        if (userInfo.agentType !== AgentTypeEnum.DECONCENTRATED_ADMIN) return;
        if (userInfo.decentralizedLevel === AdminTerritorialLevel.REGIONAL)
            userInfo.region = userInfo.decentralizedTerritory;
        if (userInfo.decentralizedLevel === AdminTerritorialLevel.DEPARTMENTAL)
            userInfo.region = await geoService.getRegionFromDepartment(userInfo.decentralizedTerritory);
    }
}

const userProfileService = new UserProfileService();
export default userProfileService;
