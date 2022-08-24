import { NextFunction, Request } from "express";
import SSEResponse from "../sse/@types/SSEResponse";

export interface ControllerRouteDEF {
    method: "GET" | "POST" | "PUT" | "DELETE";
    route: string;
    function: (req: Request, res: SSEResponse, next: NextFunction) => unknown;
    securityRoles: string[]
}

export interface ControllerMethod {
    (): ControllerRouteDEF;
}
