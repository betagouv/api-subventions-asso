import path from "path";
import { NextFunction, Request, Response } from "express";
import Controller from "../../../../decorators/controller.decorator";
import { Get } from "../../../../decorators/http.methods.decorator";

@Controller("/mentions-legales")
export default class LegalNoticeController {
    @Get("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public legalNoticeView(req: Request, res: Response, next: NextFunction) {
        res.sendFile(path.join(__dirname, "../../../../../static/svelte-index.html"));
    }
}
