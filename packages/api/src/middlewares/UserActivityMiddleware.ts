import { NextFunction, Response } from "express";
import { isRequestFromAdmin } from "../shared/helpers/HttpHelper";
import { IdentifiedRequest } from "../@types";
import userCrudService from "../modules/user/services/crud/user.crud.service";

export default function UserActivityMiddleware(req: IdentifiedRequest, _res: Response, next: NextFunction) {
    if (!req.user || isRequestFromAdmin(req)) return next();
    const user = req.user;
    user.lastActivityDate = new Date();

    userCrudService.update(user).finally(() => {
        next();
    });
}
