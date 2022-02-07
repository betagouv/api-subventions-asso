import { Route, Get, Controller, Tags, Security } from 'tsoa';
import { Rna } from '../../../../@types/Rna';
import { Siret } from '../../../../@types/Siret';

import searchService from "../../search.service";

@Route("search")
@Security("jwt")
@Tags("Search Controller")
export class SearchController extends Controller {
    /**
     * Recherche des demandes de subventions via le siret de l'association
     * @param siret Identifiant Siret
     */
    @Get("/etablissement/{siret}")
    public async findBySiret(
        siret: Siret,
    ): Promise<{success: false, message: string } | { success: true, etablissement: unknown}>{
        const result = await searchService.getBySiret(siret);

        if (!result) {
            this.setStatus(404);
            return { success: false, message: "Etablissement not found"}
        }

        return { success: true, etablissement: result };
    }

    /**
     * Recherche des demandes de subventions via le rna de l'association
     * @param rna Identifiant RNA
     */
    @Get("/association/{rna}")
    public async findByRna(
        rna: Rna,
    ):  Promise<{success: false, message: string } | { success: true, association: unknown}> {
        const result = await searchService.getByRna(rna);
        if (!result) {
            this.setStatus(404);
            return { success: false, message: "Association not found"}
        }

        return { success: true, association: result };
    }
}
