import { NextFunction, Request, Response } from "express";

export interface ControllerRouteDEF {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    route: string,
    function: (req: Request, res: Response, next: NextFunction) => unknown
}

export default interface ControllerMethod {
    () : ControllerRouteDEF
}