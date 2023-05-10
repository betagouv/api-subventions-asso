import { ObjectId } from "mongodb";
import * as RepositoryHelper from "./RepositoryHelper";

const USER_DBO = {
    _id: new ObjectId(1),
    email: "test22@beta.gouv.fr",
    hashPassword: "PASSWORD",
    roles: ["user"],
    signupAt: new Date(),
    jwt: { token: "TOKEN", expirateDate: new Date() },
    active: false,
};

describe("removeSecrets", () => {
    it("should remove all secret in user", () => {
        const actual = RepositoryHelper.removeSecrets(USER_DBO);
        expect(actual).toMatchSnapshot();
    });
});
