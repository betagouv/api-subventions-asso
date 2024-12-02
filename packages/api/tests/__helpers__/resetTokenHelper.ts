import RandToken from "rand-token";

import UserReset from "../../src/modules/user/entities/UserReset";
import userResetPort from "../../src/dataProviders/db/user/user-reset.port";

export const createResetToken = async userId => {
    const token = RandToken.generate(32);
    const reset = new UserReset(userId, token, new Date());
    return await userResetPort.create(reset);
};
