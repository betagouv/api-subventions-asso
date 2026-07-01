import { NextFunction, Response } from "express";
import { IdentifiedRequest } from "../@types";
import userCrudService from "../modules/user/services/crud/user.crud.service";
import UserEntity from "../domain/users/UserEntity";

export default function userActivityMiddleware(req: IdentifiedRequest, _res: Response, next: NextFunction) {
    if (!req.user) return next();
    const user = req.user;
    user.lastActivityDate = new Date();

    userCrudService.update(new UserEntity(user as UserEntity)).finally(() => {
        next();
    });
}
