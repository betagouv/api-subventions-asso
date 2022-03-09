import { NextFunction, Request, Response } from 'express';
import Controller from '../../decorators/controller.decorator';
import { Get } from '../../decorators/http.methods.decorator';
import apiDatasubService from '../../shared/apiDatasub.service';
import IdentifierHelper from '../../shared/helpers/IdentifierHelper';

@Controller("/download")
export default class DownloadController {

    @Get("/json/association/*")
    public async downloadAsso(req: Request, res: Response, next: NextFunction) {
        const [_, id] = req.url.split("/json/association/");
        if (!id) {
            res.statusCode = 422;
            return res.render("error");
        }

        const type = IdentifierHelper.findType(id);

        if (type !== "RNA" && type !== "SIREN") {
            res.statusCode = 422;
            return res.render("error");
        } 

        const result = await apiDatasubService.searchAssoByRna(id, req);

        if (result.status != 200 || !result.data.success || !result.data.association) {
            res.statusCode = 422;
            return res.render("error");
        } 
        
        res.send(JSON.stringify(result.data.association, null, 4));
    }
}