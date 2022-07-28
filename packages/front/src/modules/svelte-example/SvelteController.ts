import path from "path";
import { Request, Response } from "express";
import Controller from "../../decorators/controller.decorator";
import { Get } from "../../decorators/http.methods.decorator";

@Controller("/svelte")
export default class SvelteController {
    @Get("/hello")
    public async helloWorld(req: Request, res: Response) {
        res.sendFile(path.join(__dirname, "../../../static/svelte-index.html"));
    }
}
