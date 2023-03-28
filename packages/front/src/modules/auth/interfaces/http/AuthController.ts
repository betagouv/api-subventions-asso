import path from "path";
import { NextFunction, Request, Response } from "express";
import Controller from "../../../../decorators/controller.decorator";
import { Get } from "../../../../decorators/http.methods.decorator";

@Controller("/auth")
export default class AuthController {
    @Get("logout")
    public logout(req: Request, res: Response, next: NextFunction) {
        req.session.destroy(err => {
            if (err) console.error(err);
            res.redirect("/auth/login");
        });
    }

    @Get("login")
    public loginView(req: Request, res: Response, next: NextFunction) {
        return res.sendFile(path.join(__dirname, "../../../../../static/svelte-index.html"));
    }

    @Get("forget-password")
    public forgetPasswordView(req: Request, res: Response) {
        return res.sendFile(path.join(__dirname, "../../../../../static/svelte-index.html"));
    }

    @Get("reset-password/:tokenId")
    public resetPasswordView(req: Request, res: Response, next: NextFunction) {
        return res.sendFile(path.join(__dirname, "../../../../../static/svelte-index.html"));
    }

    @Get("signup")
    public async signupView(req: Request, res: Response, next: NextFunction) {
        return res.sendFile(path.join(__dirname, "../../../../../static/svelte-index.html"));
    }

    @Get("user")
    public async getUser(req: Request, res: Response) {
        if (!req.session.user) res.redirect("/login");
        res.send(req.session.user);
    }
}
