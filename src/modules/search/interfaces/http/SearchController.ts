import { Route, Get, Controller, Tags } from 'tsoa';
import { Rna } from '../../../../@types/Rna';
import { Siret } from '../../../../@types/Siret';

import searchService from "../../search.service";

@Route("search")
@Tags("SearchController")
export class SearchController extends Controller {
    /**
     * Recherche des demandes de subventions via le siret de l'association
     * @param siret Identifiant Siret
     */
    @Get("/siret/{siret}")
    public findBySiret(siret: Siret) {
        return searchService.getBySiret(siret);
    }

    /**
     * Recherche des demandes de subventions via le rna de l'association
     * @param rna Identifiant RNA
     */
    @Get("/rna/{rna}")
    public findByRna(rna: Rna) {
        return searchService.getByRna(rna);
    }
}
