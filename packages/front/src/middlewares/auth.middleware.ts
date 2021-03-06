import { NextFunction, Request, Response } from "express";
import { DefaultObject } from "../@types/utils";

const routesWithoutLogin = [
    "/auth/login",
    "/auth/reset-password",
    "/auth/forget-password",
    "/auth/signup",
    "/mentions-legales",
    "/contact"
]

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const sessionData = req.session as unknown as DefaultObject<DefaultObject>;
    if (!sessionData.user) {
        sessionData.user = {}
    }
    const token = sessionData.user.token;

    if (!token && !routesWithoutLogin.some(route => req.path.includes(route))) return res.redirect("/auth/login");

    res.locals.user = sessionData.user;

    if (token && req.path.includes("/auth/login")) return res.redirect("/");
    next();
};

export default authMiddleware;