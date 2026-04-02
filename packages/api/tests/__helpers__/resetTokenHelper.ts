import RandToken from "rand-token";

import UserReset from "../../src/modules/user/entities/UserReset";
import userResetAdapter from "../../src/adapters/db/user/user-reset.adapter";

export const createResetToken = async userId => {
    const token = RandToken.generate(32);
    const reset = new UserReset(userId, token, new Date());
    return await userResetAdapter.create(reset);
};
