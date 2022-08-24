import { LoginDtoErrorCodes, ResetPasswordErrorCodes, SignupErrorCodes } from "@api-subventions-asso/dto";
import { NextFunction, Request, Response } from "express";
import User from "../../../../@types/User";
import { DefaultObject } from "../../../../@types/utils";
import Controller from "../../../../decorators/controller.decorator";
import { Get, Post } from "../../../../decorators/http.methods.decorator";
import userService from "../../../user/user.service";
import authService from "../../AuthService";

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
        res.render("auth/login/login", {
            pageTitle: "Connexion",
            success: req.query.success
        });
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
        sessionData.user = result.data;

        const rolesResult = await userService.getRoles(result.data as User);

        if (rolesResult.type === "SUCCESS") {
            sessionData.roles = rolesResult.data;
        }

        res.redirect("/");
    }

    @Get("forget-password")
    public forgetPasswordView(req: Request, res: Response) {
        res.render("auth/forget-password/index", {
            pageTitle: "Mot de passe perdu"
        });
    }

    @Post("forget-password")
    public async forgetPasswordPost(req: Request, res: Response) {
        if (!req.body.email) {
            res.statusCode = 422;
            return res.render("auth/forget-password/index", {
                pageTitle: "Mot de passe perdu",
                error: true
            });
        }

        const result = await authService.forgetPassword(req.body.email);

        if (result.type !== "SUCCESS") {
            res.statusCode = 422;
            return res.render("auth/forget-password/index", {
                pageTitle: "Mot de passe perdu",
                error: true
            });
        }

        return res.render("auth/forget-password/index", {
            pageTitle: "Mot de passe perdu",
            success: true
        });
    }

    @Get("reset-password/:tokenId")
    public resetPasswordView(req: Request, res: Response, next: NextFunction) {
        const id = req.params.tokenId;

        if (!id) {
            res.statusCode = 422;
            return res.render("error");
        }

        res.render("auth/reset-password/resetPassword", {
            pageTitle: "Changement de mot de passe",
            token: id,
            activation: req.query.active
        });
    }

    @Get("reset-password/*")
    public async resetPasswordViewHOTFIX(req: Request, res: Response, next: NextFunction) {
        req.params.tokenId = req.path.split("reset-password/")[1];
        return this.resetPasswordView(req, res, next);
    }

    @Post("reset-password/:tokenId")
    public async resetPasswordPost(req: Request, res: Response, next: NextFunction) {
        if (!req.body.token || !req.body.password) {
            const id = req.params.tokenId;

            if (!id || !req.body.token) {
                res.statusCode = 500;
                return res.render("error");
            }

            res.statusCode = 422;
            return res.render("auth/reset-password/resetPassword", {
                pageTitle: "Changement de mot de passe",
                token: id || req.body.token,
                activation: req.query.active,
                error: ResetPasswordErrorCodes.INTERNAL_ERROR,
                errorCodes: ResetPasswordErrorCodes
            });
        }

        const result = await authService.resetPassword(req.body.token, req.body.password);

        if (result.type === "ERROR") {
            res.statusCode = 422;
            return res.render("auth/reset-password/resetPassword", {
                pageTitle: "Changement de mot de passe",
                token: req.body.token,
                activation: req.query.active,
                error: result.code,
                errorCodes: ResetPasswordErrorCodes
            });
        }
        res.redirect("/auth/login?success=" + (req.query.active ? "COMPTE_ACTIVED" : "PASSWORD_CHANGED"));
    }

    @Post("reset-password/*")
    public async resetPasswordPostHOTFIX(req: Request, res: Response, next: NextFunction) {
        req.params.tokenId = req.path.split("reset-password/")[1];
        return this.resetPasswordPost(req, res, next);
    }

    @Get("signup")
    public async signupView(req: Request, res: Response, next: NextFunction) {
        return res.render("auth/signup/index", {
            pageTitle: `Créer votre compte sur ${res.locals.appName}`
        });
    }

    @Post("signup")
    public async signupPost(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;

        const result = await authService.signup(email);

        if (result.type === "SUCCESS") {
            return res.render("auth/signup/index", {
                pageTitle: `Créer votre compte sur ${res.locals.appName}`,
                success: true,
                signupMail: email
            });
        }

        return res.render("auth/signup/index", {
            pageTitle: `Créer votre compte sur ${res.locals.appName}`,
            error: true,
            errorCode: result.code,
            SignupErrorCodes
        });
    }

    @Get("token")
    public async getUser(req: Request, res: Response) {
        if (!req.session.user) res.redirect("/login");
        res.send(req.session.user);
    }
}
