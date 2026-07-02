import { AgentJobTypeEnum, AgentTypeEnum } from "dto";
import { USER_EMAIL } from "../../../../tests/__helpers__/userHelper";
import { RoleEnum, UserRoles } from "../../../domain/users/@types/UserRoles";
import UserEntity from "../../../domain/users/UserEntity";
import NewUserEntity from "../../../domain/users/NewUserEntity";

export const SIGNED_TOKEN = "SIGNED_TOKEN";

export const USER_WITHOUT_SECRET = new UserEntity({
    id: "635132a527c9bfb8fc7c758e",
    email: USER_EMAIL,
    roles: [UserRoles.USER],
    signupAt: new Date(),
    firstName: "Prénom",
    lastName: "NOM",
    active: true,
    profileToComplete: false,
    lastActivityDate: new Date(),
    nbVisits: 123,
});

export const USER_SECRETS = {
    jwt: { token: SIGNED_TOKEN, expirateDate: new Date() },
    hashPassword: "HASH_PASSWORD",
};

export const USER_ENTITY = new UserEntity({ ...USER_WITHOUT_SECRET, ...USER_SECRETS });

// used to mock class return value when the class is being mock inside the test file
// it does not use the constructor as it will be mocked and those will return an empty object
export const OBJECT_NEW_USER_ENTITY = {
    id: undefined,
    email: USER_ENTITY.email,
    roles: USER_ENTITY.roles,
    firstName: USER_ENTITY.firstName,
    lastName: USER_ENTITY.lastName,
    jwt: USER_SECRETS.jwt,
    signupAt: new Date("2026-06-23"),
    lastActivityDate: new Date("2026-06-23"),
    nbVisits: 0,
    active: false,
    profileToComplete: true,
} as NewUserEntity;

export const USER_NOT_PERSISTED = new NewUserEntity({
    email: USER_ENTITY.email,
    roles: USER_ENTITY.roles,
    firstName: USER_ENTITY.firstName,
    lastName: USER_ENTITY.lastName,
    jwt: USER_SECRETS.jwt,
});

export const CONSUMER_USER = new UserEntity({ ...USER_WITHOUT_SECRET, roles: [RoleEnum.user, RoleEnum.consumer] });

export const ANONYMIZED_USER = new UserEntity({
    ...USER_WITHOUT_SECRET,
    active: false,
    email: "635132a527c9bfb8fc7c758e@deleted.datasubvention.beta.gouv.fr",
    jwt: undefined,
    hashPassword: "",
    firstName: "",
    lastName: "",
    disable: true,
    phoneNumber: "",
});

export const USER_ACTIVATION_INFO = {
    password: "",
    agentType: AgentTypeEnum.CENTRAL_ADMIN,
    phoneNumber: "",
    service: "",
    jobType: [AgentJobTypeEnum.ADMINISTRATOR],
};

export const UNACTIVATED_USER = { ...USER_WITHOUT_SECRET, ...{ active: false, profileToComplete: true } };
export const USER_WITHOUT_PASSWORD = new UserEntity({
    ...USER_WITHOUT_SECRET,
    jwt: USER_SECRETS.jwt,
});
