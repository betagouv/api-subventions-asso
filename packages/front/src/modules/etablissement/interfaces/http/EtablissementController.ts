import { NextFunction, Request, Response } from 'express';
import { DefaultObject } from '../../../../@types/utils';
import Controller from '../../../../decorators/controller.decorator';
import { Get } from '../../../../decorators/http.methods.decorator';
import etablissementService from '../../EtablissementService';

@Controller("/etablissement")
export default class EtablissementController {

    @Get("/:id")
    public async etablissementView(req: Request, res: Response, next: NextFunction) {
        const siret = req.params.id;

        if (!siret) return res.redirect("/?error=TYPE_UNKNOWN");

        const result = await etablissementService.getEtablissement(siret, req.session.user)  as { type: "SUCCESS" | "ERROR", data: DefaultObject };

        if (result.type != "SUCCESS") {
            return res.redirect("/?error=TYPE_UNKNOWN"); // TODO send error
        }

        res.render('etablissement/index', {
            pageTitle: 'Établissement',
            etablissement: result.data.etablissement,
            association: result.data.association,
            subventions: result.data.subventions,
            versements: result.data.versements
        });
    }
}