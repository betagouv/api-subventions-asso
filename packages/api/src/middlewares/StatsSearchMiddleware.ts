import { NextFunction, Request, Response } from "express";
import { UserWithoutSecret } from "../modules/user/entities/User";
import userService from "../modules/user/user.service";

export default async function StatsSearchMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.user) return next();
    const user = req.user as UserWithoutSecret;

    user.stats.searchCount++;
    user.stats.lastSearchDate = new Date();
    await userService.update(user);

    next();
}

export const StatsSearchRoutesRegex = [
    new RegExp("/association/[Ww0-9]{9,10}$"),
    new RegExp("/etablissement"),
    new RegExp("/search")
]