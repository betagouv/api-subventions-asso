import path from "path";
import UserDto from "@api-subventions-asso/dto/user/UserDto";
import { NextFunction, Request, Response } from "express";
import { DefaultObject } from "../../../../@types/utils";
import Controller from "../../../../decorators/controller.decorator";
import { Get, Post } from "../../../../decorators/http.methods.decorator";
import adminService from "../../user.service";

@Controller("/admin")
export default class AdminController {
    private checkRoleAndUseSvelte(req: Request, res: Response) {
        if (!req.session.user.roles || !req.session.user.roles.includes("admin")) {
            return res.redirect("/");
        }

        res.sendFile(path.join(__dirname, "../../../../../static/svelte-index.html"));
    }

    @Get("")
    public adminView(req: Request, res: Response, next: NextFunction) {
        return this.checkRoleAndUseSvelte(req, res);
    }

    @Get("/users/list")
    public listUsersView(req: Request, res: Response, next: NextFunction) {
        return this.checkRoleAndUseSvelte(req, res);
    }

    @Get("/users/metrics")
    public domainUsersView(req: Request, res: Response, next: NextFunction) {
        return this.checkRoleAndUseSvelte(req, res);
    }

    @Get("/users/create")
    public createUserView(req: Request, res: Response, next: NextFunction) {
        return this.checkRoleAndUseSvelte(req, res);
    }

    @Get("/stats")
    public statsView(req: Request, res: Response, next: NextFunction) {
        return this.checkRoleAndUseSvelte(req, res);
    }

    @Post("/users/create")
    public async createUser(req: Request, res: Response, next: NextFunction) {
        if (!req.session.user.roles || !req.session.user.roles.includes("admin")) {
            return res.redirect("/");
        }

        if (!req.body.email) {
            return res.render("admin/create-user", {
                pageTitle: "Admin - Création d'utilisateur",
                error: "USER_EMAIL_NOT_FOUND"
            });
        }

        const result = await adminService.createUser(req.body.email, req.session.user);

        return res.render("admin/create-user", {
            pageTitle: "Admin - Création d'utilisateur",
            error: result.type === "SUCCESS" ? null : "API_ERROR",
            success: result.type === "SUCCESS"
        });
    }
}
