import { NextFunction, Request, Response } from 'express';
import Controller from '../../../../decorators/controller.decorator';
import { Get } from '../../../../decorators/http.methods.decorator';
import apiDatasubService from '../../../../shared/apiDatasub.service';
import IdentifierHelper from '../../../../shared/helpers/IdentifierHelper';
import downloadService from '../../DownloadService';

@Controller("/download")
export default class DownloadController {

    @Get("/json/association/:id")
    public async downloadAsso(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        if (!id) {
            res.statusCode = 422;
            return res.render("error");
        }

        const result = await downloadService.downloadAssociation(id, req.session.user)

        if (result.type === "ERROR") {
            res.statusCode = 422;
            return res.render("error");
        }
        
        res.send(JSON.stringify(result.data, null, 4));
    }

    @Get("/json/etablissement/:id")
    public async downloadEtablissement(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        
        if (!id) {
            res.statusCode = 422;
            return res.render("error");
        }

        const result = await downloadService.downloadEtablissement(id, req.session.user)

        if (result.type === "ERROR") {
            res.statusCode = 422;
            return res.render("error");
        }
        
        res.send(JSON.stringify(result.data, null, 4));
    }
}