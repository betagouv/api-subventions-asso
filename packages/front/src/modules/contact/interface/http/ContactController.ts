import { NextFunction, Request, Response } from "express";
import Controller from "../../../../decorators/controller.decorator";
import { Get } from "../../../../decorators/http.methods.decorator";

@Controller("/contact")
export default class ContactController {
    @Get("")
    public contactView(req: Request, res: Response, next: NextFunction) {
        res.render("contact/index.ejs", {
            pageTitle: "Contactez-nous"
        });
    }
}
