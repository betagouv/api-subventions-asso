import path from "path";
import { NextFunction, Request, Response } from "express";
import Controller from "../decorators/controller.decorator";
import { Get } from "../decorators/http.methods.decorator";

@Controller("/404")
export default class NotFoundController {
    private useSvelte(res: Response) {
        res.sendFile(path.join(__dirname, "../../static/svelte-index.html"));
    }

    @Get("")
    public adminView(req: Request, res: Response, next: NextFunction) {
        return this.useSvelte(res);
    }
}
