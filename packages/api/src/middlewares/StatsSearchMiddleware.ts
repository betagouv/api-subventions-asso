import UserDto from "@api-subventions-asso/dto/user/UserDto";
import { NextFunction, Response, Request } from "express";
import userService from "../modules/user/user.service";

export default async function StatsSearchMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.user) return next();
    const user = req.user as UserDto;

    user.stats.searchCount++;
    user.stats.lastSearchDate = new Date();
    await userService.update(user);

    next();
}

export const StatsSearchRoutesRegex = [
    new RegExp("/association/[Ww0-9]{9,10}$"),
    new RegExp("/etablissement"),
    new RegExp("/search"),
];
