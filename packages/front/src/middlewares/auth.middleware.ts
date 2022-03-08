import { NextFunction, Request, Response } from "express";
import { DefaultObject } from "../@types/utils";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const sessionData = req.session as unknown as DefaultObject<DefaultObject>;
    if (!sessionData.user) {
        sessionData.user = {}
    }
    const token = sessionData.user.token;
    if (!token && !req.path.includes("/auth/login")) return res.redirect("/auth/login");
    if (token && req.path.includes("/auth/login")) return res.redirect("/");
    next();
};

export default authMiddleware;