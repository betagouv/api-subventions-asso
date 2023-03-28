import path from "path";
import { NextFunction, Request, Response } from "express";
import Controller from "../../../../decorators/controller.decorator";
import { Get, Post } from "../../../../decorators/http.methods.decorator";
import adminService from "../../user.service";

/* eslint-disable @typescript-eslint/no-unused-vars */
@Controller("/admin")
export default class AdminController {
    private useSvelte(res: Response) {
        res.sendFile(path.join(__dirname, "../../../../../static/svelte-index.html"));
    }

    @Get("")
    public adminView(req: Request, res: Response, next: NextFunction) {
        return this.useSvelte(res);
    }

    @Get("/users/list")
    public listUsersView(req: Request, res: Response, next: NextFunction) {
        return this.useSvelte(res);
    }

    @Get("/users/metrics")
    public domainUsersView(req: Request, res: Response, next: NextFunction) {
        return this.useSvelte(res);
    }

    @Get("/users/create")
    public createUserView(req: Request, res: Response, next: NextFunction) {
        return this.useSvelte(res);
    }

    @Get("/stats")
    public statsView(req: Request, res: Response, next: NextFunction) {
        return this.useSvelte(res);
    }
}
