import { IAssociation } from '@api-subventions-asso/dto';
import DemandeSubvention from '@api-subventions-asso/dto/search/DemandeSubventionDto';
import ProviderValue from '@api-subventions-asso/dto/shared/ProviderValue';
import e, { NextFunction, Request, Response } from 'express';
import { DefaultObject } from '../../@types/utils';
import Controller from '../../decorators/controller.decorator';
import { Get } from '../../decorators/http.methods.decorator';
import apiDatasubService from '../../shared/apiDatasub.service';
import IdentifierHelper from '../../shared/helpers/IdentifierHelper';
import ProviderValueHelper from '../../shared/helpers/ProviderValueHelper';

@Controller("/search")
export default class SearchController {

    @Get("/association")
    public async loginView(req: Request, res: Response, next: NextFunction) {
        if (!req.query["search-input"]) return res.redirect("/");
        const searchInput = req.query["search-input"] as string;

        const type = IdentifierHelper.findType(searchInput);

        if (type === "UNKNOWN") return res.redirect("/?error=TYPE_UNKNOWN"); // TODO send error

        if (type === "RNA" || type === "SIREN") {
            return res.redirect("/association/" + searchInput);
        }


        if (type === "SIRET") {
            return res.redirect("/etablissement/" + searchInput);
        }

        return res.redirect("/?error=ASSO_NOT_FOUND"); // TODO send error
    }
}