import { UserDto } from "dto";
import { NextFunction, Response, Request } from "express";
import userCrudService from "../modules/user/services/crud/user.crud.service";

export default async function StatsSearchMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.user) return next();
    const user = req.user as UserDto;

    await userCrudService.update(user);

    next();
}

export const StatsSearchRoutesRegex = [
    new RegExp("/association/[Ww0-9]{9,10}$"),
    new RegExp("/etablissement"),
    new RegExp("/search"),
];
