import { Route, Get, Controller, Tags, Security } from 'tsoa';
import { Rna } from '../../../../@types/Rna';
import { Siret } from '../../../../@types/Siret';

import searchService from "../../search.service";

@Route("search")
@Tags("Search Controller")
export class SearchController extends Controller {
    /**
     * Recherche des demandes de subventions via le siret de l'association
     * @param siret Identifiant Siret
     */
    @Get("/siret/{siret}")
    @Security("jwt")
    public findBySiret(
        siret: Siret,
    ) {
        return searchService.getBySiret(siret);
    }

    /**
     * Recherche des demandes de subventions via le rna de l'association
     * @param rna Identifiant RNA
     */
    @Get("/rna/{rna}")
    @Security("jwt")
    public findByRna(
        rna: Rna,
    ) {
        return searchService.getByRna(rna);
    }
}
