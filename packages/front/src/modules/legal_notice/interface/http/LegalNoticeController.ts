import { NextFunction, Request, Response } from 'express';
import Controller from '../../../../decorators/controller.decorator';
import { Get } from '../../../../decorators/http.methods.decorator';

@Controller("/mentions-legales")
export default class LegalNoticeController {

    @Get("")
    public legalNoticeView(req: Request, res: Response, next: NextFunction) {
        res.render('legal_notice/index.ejs', {
            pageTitle: 'Mentions Légales',
            error: req.query.error
        })
    }
}