import { NextFunction, Request, Response } from "express";
import Controller from "../../../../decorators/controller.decorator";
import { Get } from "../../../../decorators/http.methods.decorator";

@Controller("/")
export default class HomeController {
    @Get("")
    public loginView(req: Request, res: Response, next: NextFunction) {
        res.render("home/home", {
            pageTitle: "Accueil",
            error: req.query.error
        });
    }
}
