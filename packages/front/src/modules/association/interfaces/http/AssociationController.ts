import { NextFunction, Request, Response } from 'express';
import { DefaultObject } from '../../../../@types/utils';
import Controller from '../../../../decorators/controller.decorator';
import { Get } from '../../../../decorators/http.methods.decorator';
import associationService from '../../AssociationService';

@Controller("/association")
export default class AssociationController {

    @Get("/:id")
    public async associationView(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;

        if (!id) return res.redirect("/?error=TYPE_UNKNOWN");

        const result = await associationService.getAssociation(id, req.session.user) as { type: "SUCCESS" | "ERROR", data: DefaultObject };

        if (result.type !== "SUCCESS") {
            return res.redirect("/?error=TYPE_UNKNOWN");
        }
        
        res.render('association/index', {
            pageTitle: 'Recherche',
            value: id,
            association: result.data.association,
            subventions: result.data.subventions
        });
    }
    
}