import { Route, Get, Controller, Tags, Security } from 'tsoa';
import { Rna } from '../../../../@types/Rna';
import { Siret } from '../../../../@types/Siret';

import searchService from "../../search.service";
import AssociationDto from './dto/AssociationDto';
import EtablissementDto from './dto/EtablissmentDto';

@Route("search")
@Security("jwt")
@Tags("Search Controller")
export class SearchController extends Controller {
    /**
     * Recherche des demandes de subventions via le siret de l'établissment
     * @param siret Identifiant Siret
     */
    @Get("/etablissement/{siret}")
    public async findBySiret(
        siret: Siret,
    ): Promise<{ success: boolean, etablissement?: unknown, message?: string}>{
        const result = await searchService.getBySiret(siret) as EtablissementDto;

        if (!result) {
            this.setStatus(404);
            return { success: false, message: "Etablissement not found"}
        } else {
            return { success: true, etablissement: result };
        }
    }

    /**
     * Recherche des demandes de subventions via le rna de l'association
     * @param rna Identifiant RNA
     */
    @Get("/association/{rna}")
    public async findByRna(
        rna: Rna,
    ): Promise<{ success: boolean, association?: unknown, message?: string}> {
        const result = await searchService.getByRna(rna) as AssociationDto;
        if (!result) {
            this.setStatus(404);
            return { success: false, message: "Association not found"}
        }

        return { success: true, association: result };
    }
}
