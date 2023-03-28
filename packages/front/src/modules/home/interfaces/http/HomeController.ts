import path from "path";
import { NextFunction, Request, Response } from "express";
import Controller from "../../../../decorators/controller.decorator";
import { Get } from "../../../../decorators/http.methods.decorator";

/* eslint-disable @typescript-eslint/no-unused-vars */
@Controller("/")
export default class HomeController {
    @Get("")
    public loginView(req: Request, res: Response, next: NextFunction) {
        res.sendFile(path.join(__dirname, "../../../../../static/svelte-index.html"));
    }
}
