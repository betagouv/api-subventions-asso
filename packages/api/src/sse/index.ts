import { Express, NextFunction, Request, Response } from "express";
import { expressAuthentication } from "../authentication/authentication"
import { DefaultObject, ControllerRouteDEF, ControllerMethod } from "../@types";
import SSEResponse from "./@types/SSEResponse";

import controllers from "../modules/controllers.sse";

export default function RegisterSSERoutes(app: Express) {
    controllers.forEach(controllerClass => {
        const controller = new controllerClass() as unknown as DefaultObject<ControllerMethod>;
        const basePath = (controller as unknown as DefaultObject<string>).basePath;
        const option = (controller as unknown as DefaultObject<DefaultObject<string>>).option;
    
        (controller.__methods__ as unknown as ControllerRouteDEF[]).forEach((method: ControllerRouteDEF) => {
            const describe = method;
            const route = `${basePath}/${describe.route}`.replace("//", "/");
    
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers: any[] = [sseHandler, describe.function.bind(controller)]

            if (option.security) {
                handlers.unshift(securityHandler(option.security, describe.securityRoles));
            }

            switch (describe.method) {
                case "POST":
                    app.post(route, ...handlers);
                    break;
                case "PUT":
                    app.put(route, ...handlers);
                    break;
                case "DELETE":
                    app.delete(route, ...handlers);
                    break;
                case "GET":
                default:
                    app.get(route, ...handlers);
                    break;
            }
        });
    });
}

function sseHandler(req: Request, res: SSEResponse, next: NextFunction) {
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    res.flushHeaders();

    // Tell the client to retry every 10 seconds if connectivity is lost
    res.write('retry: 10000\n\n');

    res.write("event: messages\n\n");

    res.sendSSEData = (data: unknown) =>  res.write(`data: ${JSON.stringify(data)}\n\n`);
    next();
}

function securityHandler(security: string, roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => expressAuthentication(req, security, roles).then(() => next()).catch(e => next(e));
}