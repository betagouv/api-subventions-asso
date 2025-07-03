import { NextFunction, Request, Response } from "express";

export interface ControllerRouteDEF {
    method: "GET" | "POST" | "PUT" | "DELETE";
    route: string;
    function: (req: Request, res: Response, next: NextFunction) => unknown;
    securityRoles: string[];
}

export interface ControllerMethod {
    (): ControllerRouteDEF;
}
