import { LoginDtoErrorCodes } from "@api-subventions-asso/dto";
import { NextFunction, Request, Response } from "express";
import { DefaultObject } from "../../../../@types/utils";
import Controller from "../../../../decorators/controller.decorator";
import { Get, Post } from "../../../../decorators/http.methods.decorator";
import authService from "../../AuthService";
import path from "path";

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

    @Post("login")
    public async loginPost(req: Request, res: Response, next: NextFunction) {
        if (!req.body.email || !req.body.password) {
            return res.render("auth/login/login", {
                pageTitle: "Connexion",
                loginError: true,
                errorCode: LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH,
                errorCodes: LoginDtoErrorCodes
            });
        }

        const result = await authService.login(req.body.email, req.body.password);

        if (result.type === "ERROR") {
            res.statusCode = 422;
            return res.render("auth/login/login", {
                pageTitle: "Connexion",
                loginError: true,
                errorCode: result.code,
                errorCodes: LoginDtoErrorCodes
            });
        }

        const sessionData = req.session as unknown as DefaultObject;
        sessionData.user = result.data.user;

        res.redirect("/");
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
