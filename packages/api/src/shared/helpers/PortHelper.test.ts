import { ObjectId } from "mongodb";
import * as PortHelper from "./PortHelper";
import { AgentTypeEnum } from "dto";

const USER_DBO = {
    _id: new ObjectId(1),
    email: "test22@beta.gouv.fr",
    hashPassword: "PASSWORD",
    roles: ["user"],
    signupAt: new Date(),
    jwt: { token: "TOKEN", expirateDate: new Date() },
    profileToComplete: false,
    active: false,
    agentType: AgentTypeEnum.CENTRAL_ADMIN,
    jobType: [],
};

describe("removeSecrets", () => {
    it("should remove all secret in user", () => {
        const actual = PortHelper.removeSecrets(USER_DBO);
        expect(actual).toMatchSnapshot({
            _id: expect.any(ObjectId),
            signupAt: expect.any(Date),
        });
    });
});

describe("removeHashPassword", () => {
    it("should remove only hash password in user", () => {
        const actual = PortHelper.removeHashPassword(USER_DBO);
        expect(actual).toMatchSnapshot({
            _id: expect.any(ObjectId),
            signupAt: expect.any(Date),
            jwt: { expirateDate: expect.any(Date) },
        });
    });
});

describe("uniformizeId", () => {
    it("should uniformizeId id ", () => {
        const actual = PortHelper.uniformizeId(USER_DBO);
        expect(actual).toMatchObject({
            _id: expect.any(String),
        });
    });
});
