import path from "path";
import UserDto from "@api-subventions-asso/dto/user/UserDto";
import { NextFunction, Request, Response } from "express";
import { DefaultObject } from "../../../../@types/utils";
import Controller from "../../../../decorators/controller.decorator";
import { Get, Post } from "../../../../decorators/http.methods.decorator";
import adminService from "../../user.service";

@Controller("/admin")
export default class AdminController {
    @Get("")
    public async adminView(req: Request, res: Response, next: NextFunction) {
        if (!req.session.user.roles || !req.session.user.roles.includes("admin")) {
            return res.redirect("/");
        }

        res.render("admin/index", {
            pageTitle: "Admin"
        });
    }

    @Get("/users/list")
    public async listUsersView(req: Request, res: Response, next: NextFunction) {
        if (!req.session.user.roles || !req.session.user.roles.includes("admin")) {
            return res.redirect("/");
        }

        res.sendFile(path.join(__dirname, "../../../../../static/svelte-index.html"));
    }

    @Get("/users/domain")
    public async domainUsersView(req: Request, res: Response, next: NextFunction) {
        if (!req.session.user.roles || !req.session.user.roles.includes("admin")) {
            return res.redirect("/");
        }

        const result = await adminService.listUsers(req.session.user);

        const users = result.data || [];

        const usersByDomainName = users.reduce((acc, user) => {
            const domaine = user.email.match(/@.+/)?.toString();

            if (!domaine) return acc;

            if (!acc[domaine]) acc[domaine] = [];
            acc[domaine].push(user);
            return acc;
        }, {} as DefaultObject<UserDto[]>);

        res.render("admin/domain", {
            pageTitle: "Admin - Nom de domaines",
            usersByDomainName
        });
    }

    @Get("/users/create")
    public async createUserView(req: Request, res: Response, next: NextFunction) {
        if (!req.session.user.roles || !req.session.user.roles.includes("admin")) {
            return res.redirect("/");
        }

        return res.render("admin/create-user", {
            pageTitle: "Admin - Création d'utilisateur"
        });
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
