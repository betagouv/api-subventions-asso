import { NextFunction, Request, Response } from 'express';
import User from '../../../../@types/User';
import Controller from '../../../../decorators/controller.decorator';
import { Get, Post } from '../../../../decorators/http.methods.decorator';
import adminService from '../../user.service';

@Controller("/admin")
export default class AdminController {

    @Get("")
    public async adminView(req: Request, res: Response, next: NextFunction) {
        if (!req.session.roles || !req.session.roles.includes("admin")) {
            return res.redirect("/");
        }

        res.render('admin/index', {
            pageTitle: 'Admin',
        });
    }

    @Get("/users/list")
    public async listUsersView(req: Request, res: Response, next: NextFunction) {
        if (!req.session.roles || !req.session.roles.includes("admin")) {
            return res.redirect("/");
        }

        const result = await adminService.listUsers(req.session.user as User);

        res.render('admin/list-users', {
            pageTitle: 'Admin - Liste des utilisateurs',
            users: result.type === "SUCCESS" ? result.data : [],
        })
    }

    @Get("/users/create")
    public async createUserView(req: Request, res: Response, next: NextFunction) {
        if (!req.session.roles || !req.session.roles.includes("admin")) {
            return res.redirect("/");
        }

        return res.render('admin/create-user', {
            pageTitle: 'Admin - Création d\'utilisateur',
        })
    }


    @Post("/users/create")
    public async createUser(req: Request, res: Response, next: NextFunction) {
        if (!req.session.roles || !req.session.roles.includes("admin")) {
            return res.redirect("/");
        }

        if (!req.body.email) {
            return res.render('admin/create-user', {
                pageTitle: 'Admin - Création d\'utilisateur',
                error: "USER_EMAIL_NOT_FOUND",
            });
        }
        
        const result = await adminService.createUser(req.body.email, req.session.user);

        return res.render('admin/create-user', {
            pageTitle: 'Admin - Création d\'utilisateur',
            error: result.type === "SUCCESS" ? null : "API_ERROR",
            success: result.type === "SUCCESS"
        })
    }
}