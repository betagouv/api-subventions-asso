import path from "path";
import { NextFunction, Request, Response } from "express";
import Controller from "../../../../decorators/controller.decorator";
import { Get } from "../../../../decorators/http.methods.decorator";

@Controller("/etablissement")
export default class EtablissementController {
    @Get("/:id")
    public async etablissementView(req: Request, res: Response, next: NextFunction) {
        res.sendFile(path.join(__dirname, "../../../../../static/svelte-index.html"));
    }
}
