import path from "path";
import { NextFunction, Request, Response } from 'express';
import Controller from '../../../../decorators/controller.decorator';
import { Get } from '../../../../decorators/http.methods.decorator';

@Controller("/association")
export default class AssociationController {

    @Get("/:id")
    public async associationView(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;

        if (!id) return res.redirect("/?error=TYPE_UNKNOWN");

        res.sendFile(path.join(__dirname, '../../../../../static/svelte-index.html'));
    }

}