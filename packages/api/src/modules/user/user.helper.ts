import { JWT_EXPIRES_TIME } from "../../configurations/jwt.conf";

export const getNewJwtExpireDate = () => {
    return new Date(new Date().getTime() + JWT_EXPIRES_TIME);
};
