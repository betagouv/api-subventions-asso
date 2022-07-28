import path from "path";
import { NextFunction, Request, Response } from "express";
import Controller from "../../../../decorators/controller.decorator";
import { Get } from "../../../../decorators/http.methods.decorator";

@Controller("/association")
export default class AssociationController {
    @Get("/:id")
    public async associationView(req: Request, res: Response, next: NextFunction) {
        res.sendFile(path.join(__dirname, "../../../../../static/svelte-index.html"));
    }
}
