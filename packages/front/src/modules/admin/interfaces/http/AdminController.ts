import { NextFunction, Request, Response } from 'express';
import User from '../../../../@types/User';
import Controller from '../../../../decorators/controller.decorator';
import { Get, Post } from '../../../../decorators/http.methods.decorator';
import userService from '../../../user/user.service';
import adminService from '../../user.service';

@Controller("/admin")
export default class AdminController {

    @Get("")
    public async loginView(req: Request, res: Response, next: NextFunction) {
        if (!req.session.roles || !req.session.roles.includes("admin")) {
            return res.redirect("/");
        }

        const result = await adminService.listUsers(req.session.user as User);

        res.render('admin/index', {
            pageTitle: 'Admin',
            users: result.type === "SUCCESS" ? result.data : [],
            error: req.query.error,
            success: req.query.success
        })
    }

    @Post("/user/create")
    public async createUser(req: Request, res: Response, next: NextFunction) {
        if (!req.session.roles || !req.session.roles.includes("admin")) {
            return res.redirect("/");
        }

        if (!req.body.email) {
            return res.redirect("/admin?error=USER_EMAIL_NOT_FOUND")
        }
        
        const result = await adminService.createUser(req.body.email, req.session.user);

        return res.redirect("/admin?" +(result.type === "SUCCESS" ? "success=true" : "error=API_ERROR"));
    }
}