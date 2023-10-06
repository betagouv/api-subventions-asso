import { ObjectId } from "mongodb";
import { AgentJobTypeEnum, AgentTypeEnum, UserDto } from "dto";
import { USER_EMAIL } from "../../../../tests/__helpers__/userHelper";

export const SIGNED_TOKEN = "SIGNED_TOKEN";

export const USER_WITHOUT_SECRET = {
    _id: new ObjectId("635132a527c9bfb8fc7c758e"),
    email: USER_EMAIL,
    roles: ["user"],
    signupAt: new Date(),
    firstName: "",
    lastName: "",
    active: true,
    profileToComplete: false,
} as UserDto;

export const USER_SECRETS = {
    jwt: { token: SIGNED_TOKEN, expirateDate: new Date() },
    hashPassword: "HASH_PASSWORD",
};

export const USER_DBO = { ...USER_WITHOUT_SECRET, ...USER_SECRETS };

export const CONSUMER_USER = { ...USER_WITHOUT_SECRET, roles: ["user", "consumer"] };

export const ANONYMIZED_USER = {
    ...USER_WITHOUT_SECRET,
    active: false,
    email: "",
    jwt: null,
    hashPassword: "",
    disable: true,
};

export const USER_ACTIVATION_INFO = {
    password: "",
    agentType: AgentTypeEnum.CENTRAL_ADMIN,
    phoneNumber: "",
    service: "",
    jobType: [AgentJobTypeEnum.ADMINISTRATOR],
};
