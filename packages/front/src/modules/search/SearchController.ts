import { IAssociation } from '@api-subventions-asso/dto';
import { NextFunction, Request, Response } from 'express';
import Controller from '../../decorators/controller.decorator';
import { Get } from '../../decorators/http.methods.decorator';
import apiDatasubService from '../../shared/apiDatasub.service';
import IdentifierHelper from '../../shared/helpers/IdentifierHelper';

@Controller("/search")
export default class SearchController {

    @Get("/association")
    public async loginView(req: Request, res: Response, next: NextFunction) {
        if (!req.query["search-input"]) return res.redirect("/");
        const searchInput = req.query["search-input"] as string;

        const type = IdentifierHelper.findType(searchInput);

        if (type === "UNKNOWN") return res.redirect("/?error=TYPE_UNKNOWN"); // TODO send error

        let association: IAssociation | null = null;

        if (type === "RNA") {
            const result = await apiDatasubService.searchAssoByRna(searchInput, req);

            if (result.status != 200 || !result.data.success || !result.data.association) return res.redirect("/?error=ASSO_NOT_FOUND"); // TODO send error
            association = result.data.association;
        }


        if (type === "SIREN") {
            const result = await apiDatasubService.searchAssoBySiren(searchInput, req);

            if (result.status != 200 || !result.data.success || !result.data.association) return res.redirect("/?error=ASSO_NOT_FOUND"); // TODO send error
            association = result.data.association;
        }

        if (!association) return res.redirect("/?error=ASSO_NOT_FOUND"); // TODO send error
        res.render('search/index', {
            pageTitle: 'Recherche',
            value: searchInput,
            association,
        });
    }
}