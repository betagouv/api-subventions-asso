import { Route, Get, Controller, Tags, Security } from 'tsoa';
import { Rna, Siren, Siret, Association, Etablissement } from '@api-subventions-asso/dto';
import AssociationNameEntity from '../../../association-name/entities/AssociationNameEntity';

import searchService from "../../search.service";

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
    ): Promise<{ success: boolean, etablissement?: Etablissement, message?: string}>{
        const result = await searchService.getBySiret(siret) as Etablissement;
        if (!result) {
            this.setStatus(404);
            return { success: false, message: "Etablissement not found"}
        } else {
            return { success: true, etablissement: result };
        }
    }

    /**
     * Recherche des demandes de subventions via l'identifiant de l'association
     * @param rna_or_siren Identifiant RNA ou Siren
     */
    @Get("/association/{id}")
    public async findAssociation(
        id: Rna | Siren,
    ): Promise<{ success: boolean, association?: Association, message?: string}> {
        let result: Association | null = null;
        
        try {
            result = await searchService.getAssociation(id);
        } catch (e) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message }
        }

        if (!result) {
            this.setStatus(404);
            return { success: false, message: "Association not found"}
        }

        return { success: true, association: result };
    }

    /**
     * Recherche des informations liées à une association via son rna, siren et nom partiel ou complet
     * @param rna_or_siren Identifiant RNA ou Identifiant Siren
     */
    @Get("/associations/{input}")
    public async findAssociations(input: string): Promise<{ success: boolean, result?: AssociationNameEntity[], message?: string }> {
        const result = await searchService.getAssociationsKeys(input);
        if (!result || (Array.isArray(result) && result.length == 0)) {
            this.setStatus(404);
            return { success: false, message: `Could match any association with given input : ${input}`}
        }
        this.setStatus(200);
        return { success: true, result };
    }
}
