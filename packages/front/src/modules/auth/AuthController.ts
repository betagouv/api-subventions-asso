import { NextFunction, Request, Response } from 'express';
import { DefaultObject } from '../../@types/utils';
import Controller from '../../decorators/controller.decorator';
import { Get, Post } from '../../decorators/http.methods.decorator';
import apiDatasubService from '../../shared/apiDatasub.service';

@Controller("/auth")
export default class AuthController {

    @Get("login")
    public loginView(req: Request, res: Response, next: NextFunction) {
        res.render('login', {
            pageTitle: 'Connexion'
        })
    }

    @Post("login")
    public loginPost(req: Request, res: Response, next: NextFunction) {
        if (!req.body.email || !req.body.password) {
            return res.render("login", {
                pageTitle: 'Connexion',
                loginError: true
            });
        }
        apiDatasubService.login(req.body.email as string, req.body.password).then((result) => {
            if (result.status != 200) {
                res.statusCode = 422;
                return res.render("login", {
                    pageTitle: 'Connexion',
                    loginError: true
                });
            }
            const sessionData = req.session as unknown as DefaultObject;
            sessionData.user = result.data
            res.redirect("/")
        }).catch(() =>  res.render("login", {
            pageTitle: 'Connexion',
            loginError: true
        }))
    }
}