import { NextFunction, Request, Response } from "express";
import Controller from "../../../../decorators/controller.decorator";
import { Get } from "../../../../decorators/http.methods.decorator";

@Controller("/cgu")
export default class CGUController {
    @Get("")
    public cguView(req: Request, res: Response, next: NextFunction) {
        res.render("cgu/index.ejs", {
            pageTitle: "Conditions générales d’utilisation"
        });
    }
}
